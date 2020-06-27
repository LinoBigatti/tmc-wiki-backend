const express = require('express')
const compression = require('compression')
const fs = require('fs');
const app = express();
app.use(compression());

function parsePost(req) {
	console.log(req.body.test);
}

app.post('/post', (req, res) => {
	var response = parsePost(req);
	res.send(response)
});

app.get('/get', (req, res) => {
	res.send('Getpost');
});

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`);
});
