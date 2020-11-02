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
	const author = utils.cast('string', reqBody.author);
	const title = utils.cast('string', reqBody.title);
	const tags = utils.cast('string', reqBody.tags);
	const description = utils.cast('string', reqBody.description);
	const metadata = await posts.createPost(author, title, description, tags, body);
	console.log(`Created post #${metadata.id}`);
	res.send('OK')
}

const getPost = async (req, res) => {
	const postId = utils.cast('number', +utils.cast('object', req.query).id);
	if (!posts.postExists(postId)) {
		res.status(404).send(`No such post ID ${postId}`);
		return;
	}
	const networkPost = await posts.getNetworkPostObject(postId);
	// see what post number is being requested
	console.log("Post ID Number: " + postId)
	res.send(networkPost);
}
const getPost_ = async (req, res) => {
	const reqBody = utils.cast('object', req.body);
	const postId = utils.cast('number', +reqBody.id);
	if (!posts.postExists(postId)) {
		res.status(404).send(`No such post ID ${postId}`);
		return;
	}
	const networkPost = await posts.getNetworkPostObject(postId);
	// see what post number is being requested
	console.log("Post ID Number: " + postId)
	res.send(networkPost);
}

const editPost = async (req, res) => {
	const postId = utils.cast('number', +utils.cast('object', req.query).id);
	if (!posts.postExists(postId)) {
		res.status(404).send(`No such post ID ${postId}`);
		return;
	}
	const reqBody = utils.cast('object', req.body);
	const author = utils.cast('string', reqBody.author);
	if (author.length === 0) {
		res.status(403).send('Cannot have empty author');
		return;
	}
	const metadata = posts.getMetadata(postId);
	if (metadata.edit_count !== utils.cast('number', req.body.lastEditCount)) {
		res.send('OUTDATED');
		return;
	}
	metadata.edit_count++;

	await posts.setPostBody(postId, utils.cast('string', reqBody.body));
	const message = utils.cast('string', reqBody.message);
	metadata.title = utils.cast('string', reqBody.title);
	metadata.tags = utils.cast('string', reqBody.tags);
	metadata.description = utils.cast('string', reqBody.description);
	metadata.last_edited = new Date().toDateString();
	await posts.saveMetadata();
	await posts.commit(postId, message, author);
	console.log(`Edited post #${postId}`);
	res.send('OK');
}

const getAllPosts = (req, res) => {
	const all = posts.getAllMetadata();
	res.send(all);
}
const latestPosts = async (req, res) => {
	const all = posts.getAllMetadata();
	const length = all.length;
	const latest_three_posts = all.slice(length-3, length);
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