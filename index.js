const express = require('express')
const compression = require('compression')
const fs = require('fs');
const app = express();
const posts = require('./posts')
app.use(compression());
app.use(express.json());

const parsePost = (req, res) => {
	var post = new posts.Post(req.body.body, req.body.title);
	console.log(`Created post #${post.id}`);
	post.save();

	res.send('0');
}

const getPost = (req, res) => {
	var postId = posts.searchExactTitle(req.body.title);
	var post = posts.getPostMetadata()[postId];
	post.body = posts.getBody(post.id)

	res.send(post);
}

app.post('/post', parsePost);

app.post('/get', getPost);

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});
