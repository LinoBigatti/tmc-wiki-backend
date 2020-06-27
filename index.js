const express = require('express')
const compression = require('compression')
const fs = require('fs');
const app = express();
app.use(compression())

app.get('/post', (req, res) => {
	res.send('Post')
});

app.get('/get', (req, res) => {
	res.send('Getpost')
});

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`)
});
