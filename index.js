const express = require('express')
const compression = require('compression')
const fs = require('fs');
const app = express();
const Post = require('./posts')
app.use(compression());
app.use(express.json());

const parsePost = (req, res) => {
	var post = new Post(req.body.body);
	console.log(`Created post #${post.id}`);
	post.save();
	res.send('0');
}

app.post('/post', parsePost);

app.get('/get', (req, res) => {
	res.send('Getpost');
});

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});
