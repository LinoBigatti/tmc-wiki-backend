/*
TODO: read all posts backwards in order to show the NEWEST posts FIRST
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');

const xss = require('xss-clean');
const fileUpload = require('express-fileupload');

const posts = require('./posts');
const archive = require('./archive');
const utils = require('./utils');

const app = express();
app.use(bodyParser.json());
app.use(xss());
app.use(compression());
app.use(fileUpload({createParentPath: true}));
//assumes that production and development are false and that you need to supply at least one argument
let production = false, development = false;
if (process.argv.length === 2) {
	console.error('Expected at least one argument!');
	process.exit(1);
}
//gets the third argument and makes either production or developent true
const arguments = process.argv.slice(2);
if (arguments[0] === 'pro'){
	production = true;
}
else {
	development = true;
}
console.log('arguments: ', arguments);

const createPost = async (req, res) => {
	const reqBody = utils.cast('object', req.body);
	const body = utils.cast('string', reqBody.body);
	const title = utils.cast('string', reqBody.title);
	const tags = utils.cast('string', reqBody.tags);
	const description = utils.cast('string', reqBody.description);
	const post = new posts.Post(body, title, tags, description, 0);
	console.log(`Created post #${post.id}`);
	await post.save();
	res.send('OK')
}

const getPost = (req, res) => {
	const postId = utils.cast('number', utils.cast('object', req.query).id);
	const post = posts.getPostMetadata()[postId - 1];
	post.editCount = post.editCount || post.edit_count || 0;
	post.body = posts.getBody(post.id)
	// see what post number is being requested
	console.log("Post ID Number: " + postId)
	res.send(post);
}
const getPost_ = (req, res) => {
	const reqBody = utils.cast('object', req.body);
	const postId = utils.cast('number', reqBody.id);
	const post = posts.getPostMetadata()[postId - 1];
	post.editCount = post.editCount || post.edit_count || 0;
	post.body = posts.getBody(post.id)
	res.send(post);
}

const editPost = async (req, res) => {
	const postId = utils.cast('number', utils.cast('object', req.query).id);
	const oldPost = posts.getPostMetadata()[postId - 1];
	oldPost.editCount = oldPost.editCount || oldPost.edit_count || 0;
	if (oldPost.editCount !== utils.cast('number', req.body.lastEditCount)) {
		res.send('OUTDATED');
		return;
	}
	const reqBody = utils.cast('object', req.body);
	const body = utils.cast('string', reqBody.body);
	const title = utils.cast('string', reqBody.title);
	const tags = utils.cast('string', reqBody.tags);
	const description = utils.cast('string', reqBody.description);
	const post = new posts.Post(body, title, tags, description, oldPost.editCount + 1);
	post.setId(postId);
	post.edit_time(new Date().toDateString());
	console.log(`Edited post #${post.id}`);
	await post.save();
	res.send('OK');
}

const getAllPosts = (req, res) => {
	const all = posts.getPostMetadata()
	res.send(all);
}
const latestPosts = async (req, res) => {
	const length = posts.getPostMetadata().length
	const latest_three_posts = posts.getPostMetadata().slice((length-3),(length))
	res.send(latest_three_posts);
}
// if you are running in production mode
if(production) {
	app.get('/__getpost__', getPost);
	app.post('/__getpost__', getPost_);

	app.post('/__newpost__', createPost);

	app.post('/__editpost__', editPost);

	app.get('/__allposts__', getAllPosts);
	app.get('/__latestposts__', latestPosts);

	app.get('/archive/:fileName', archive.download);
	app.get('/archive', archive.index);
	app.post('/__archive-upload__', archive.uploadProcess);
}
// if you are running in development mode
if(development) {
	app.get('/api/__getpost__', getPost);
	app.post('/api/__getpost__', getPost_);

	app.post('/api/__newpost__', createPost);

	app.post('/api/__editpost__', editPost);

	app.get('/api/__allposts__', getAllPosts);
	app.get('/api/__latestposts__', latestPosts);

	app.get('/api/archive/*', archive.download);
	app.get('/api/archive', archive.index);
	app.post('/api/__archive-upload__', archive.uploadProcess);
}


app.get('/archive/*', archive.download);
app.get('/archive', archive.index);
app.post('/__archive-upload__', archive.uploadProcess);

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});