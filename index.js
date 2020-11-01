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

const app = express();
app.use(bodyParser.json());
app.use(xss());
app.use(compression());
app.use(fileUpload({createParentPath: true}));
//assumes that production and development are false and that you need to supply at least one argument
var production, development = false;
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
const parsePost = (req, res) => {
	const post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	console.log(`Created post #${post.id}`);
	post.save();
	res.send('OK')
}

const getPost = (req, res) => {
	const postId = req.query.id;
	const post = posts.getPostMetadata()[postId - 1];
	post.body = posts.getBody(post.id)
	// see what post number is being requested
	console.log("Post ID Number: " + postId)
	res.send(post);
}
const getPost_ = (req, res) => {
	const postId = req.body.id;
	const post = posts.getPostMetadata()[postId - 1];
	post.body = posts.getBody(post.id)
	res.send(post);
}

const editPost = async (req, res) => {
	const  postId = req.query.id;
	const post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	post.setId(postId);
	post.edit_time(new Date().toDateString());
	console.log(`Edited post #${post.id}`);
	post.save();
	res.send('OK')
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

	app.post('/__newpost__', parsePost);

	app.post('/__editpost__', editPost);

	app.get('/__allposts__', getAllPosts);
	app.get('/__latestposts__', latestPosts);

	app.get('/archive/*', archive.download);
	app.get('/archive', archive.index);
	app.post('/__archive-upload__', archive.uploadProcess);
}
// if you are running in development mode
if(development) {
	app.get('/api/__getpost__', getPost);
	app.post('/api/__getpost__', getPost_);

	app.post('/api/__newpost__', parsePost);

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

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});