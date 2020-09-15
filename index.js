/*
TODO: sort posts by date.
add
 */
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const xss = require('xss-clean');
const fileUpload = require('express-fileupload');

const posts = require('./posts');
const archive = require('./archive');

const mongodb_foo = require('./mongodb_foo.js')
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(bodyParser.json());
app.use(xss());
app.use(compression());
app.use(fileUpload({createParentPath: true}));
//app.use(express.urlencoded({ extended: true }));

const development = false;

const parsePost = (req, res) => {
	const post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	post.save();
	res.send('OK');
	console.log(`Created post #${req.body.title}`);
}

const getPost = (req, res) => {
	const postId = req.query.id;
	var client = new MongoClient(mongodb_foo.url)
	client.connect(function(err) {
		if(err){console.log(err); return}
		const db = client.db(mongodb_foo.dbName);
		console.log("Connected successfully to server");

		mongodb_foo.findDocumentById(db, postId, "posts", post => {
			res.send(post);
			client.close()
		})
	});
}
const getPost_ = (req, res) => {
	const postId = req.body.id;
	var client = new MongoClient(mongodb_foo.url)
	client.connect(function(err) {
		if(err){console.log(err); return}
		const db = client.db(mongodb_foo.dbName);
		console.log("Connected successfully to server");

		mongodb_foo.findDocumentById(db, postId, "posts", post => {
			res.send(post);
			client.close()
		})
	});
}

const editPost = async (req, res) => {
	const  postId = req.query.id;
	posts.Post.editbyId(postId, req.body.body, req.body.title, req.body.tags, req.body.description)
	console.log(`Edited post #${postId}`);
	res.send('OK')
}

const getAllPosts = async (req, res) => {
	posts.getPostMetadata((all) => {
		res.send(all);
	});
}
const latestPosts = async (req, res) => {
	posts.getPostMetadata((all) => {
		const length = all.length
		const latest_three_posts = all.slice((length-3),(length))
		res.send(latest_three_posts);
	});
}

app.get('/api/__getpost__', getPost);
app.post('/api/__getpost__', getPost_);

app.post('/api/__newpost__', parsePost);

app.post('/api/__editpost__', editPost);

app.get('/api/__allposts__', getAllPosts);
app.get('/api/__latestposts__', latestPosts);

if(development) {
	app.get('/api/newPost', (req, res) => { res.sendFile(__dirname + '/client/post.html'); });

	const edit = require('./client/edit');
	app.get('/api/edit', edit.clientEdit);

	const showPost = require('./client/showPost');
	app.get('/api/post', showPost.clientGet);
}


app.get('/api/archive/*', archive.download);
app.get('/api/archive', archive.index);
app.post('/api/__archive-upload__', archive.uploadProcess);

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});