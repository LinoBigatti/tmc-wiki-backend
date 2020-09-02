/*
TODO: sort posts by date.
add
 */
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const fs = require('fs');
const posts = require('./posts')

const app = express();
app.use(bodyParser.json());
app.use(compression());
//app.use(express.urlencoded({ extended: true }));

const development = false;

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

app.get('/__getpost__', getPost);
app.post('/__getpost__', getPost_);

app.post('/__newpost__', parsePost);

app.post('/__editpost__', editPost);

app.get('/__allposts__', getAllPosts);
app.get('/__latestposts__', latestPosts);

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