const express = require('express')
const compression = require('compression')
const fs = require('fs');
const app = express();
const posts = require('./posts')
app.use(compression());
app.use(express.urlencoded({ extended: true }));

const development = true;

const parsePost = (req, res) => {
	var post = new posts.Post(req.body.body, req.body.title, req.body.tags, req.body.description);
	console.log(`Created post #${post.id}`);
	post.save();

	res.send('0');
}

const searchPost = (req, res) => {		//TODO: make it work xd
	var postId = posts.searchExactTitle(req.body.title);
	var post = posts.getPostMetadata()[postId];
	post.body = posts.getBody(post.id)

	res.send(post);
}

const getPost = (req, res) => {
	var postId = req.body.id;
	var post = posts.getPostMetadata()[postId];
	post.body = posts.getBody(post.id)

	res.send(post);
}

app.post('/post', parsePost);

app.post('/search', searchPost);

app.post('/get', getPost);

if(development) {
	app.get('/clientPost', (req, res) => { res.sendFile(__dirname + '/client/post.html'); });

	app.get('/clientSearch', (req, res) => { res.sendFile(__dirname + '/client/search.html'); });
}

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});
