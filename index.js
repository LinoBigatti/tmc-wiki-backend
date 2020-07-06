const express = require('express')
const compression = require('compression')
const fs = require('fs');
const posts = require('./posts')

const app = express();
app.use(compression());
app.use(express.urlencoded({ extended: true }));

const development = true;

const parsePost = (req, res) => {
	var post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	console.log(`Created post #${post.id}`);
	post.save();

	res.send('0');
}

const getPost = (req, res) => {
	var postId = req.query.id;
	var post = posts.getPostMetadata()[postId - 1];
	post.body = posts.getBody(post.id)

	res.send(post);
}
const getPost_ = (req, res) => {
	var postId = req.body.id;
	var post = posts.getPostMetadata()[postId - 1];
	post.body = posts.getBody(post.id)

	res.send(post);
}

const sendEditData = (req, res) => {
	var postId = req.query.id;
	var post = posts.getPostMetadata()[postId - 1];
	post.body = posts.getBody(post.id)

	res.send(post);
}
const editPost = (req, res) => {
	var postId = req.query.id;
	var post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	post.setId(postId);
	console.log(`Edited post #${post.id}`);
	post.save();

	res.send('0');
}

const getAll = (req, res) => {
	var all = posts.getPostData()
	
	res.send(all);
}

app.get('/__getpost__', getPost);
app.post('/__getpost__', getPost_);

app.post('/__newpost__', parsePost);

app.get('/__editpost__', sendEditData);
app.post('/__editpost__', editPost);

app.get('/__allposts__', getAll);

if(development) {
	app.get('/newPost', (req, res) => { res.sendFile(__dirname + '/client/post.html'); });

	const edit = require('./client/edit');
	app.get('/edit', edit.clientEdit);

	const showPost = require('./client/showPost');
	app.get('/post', showPost.clientGet);
}

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});
