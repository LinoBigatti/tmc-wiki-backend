const express = require('express')
const compression = require('compression')
const app = express();
app.use(compression())

app.get('/post', (req, res) => {
	res.send('Post')
});

app.get('/get', (req, res) => {
	res.send('Getpost')
});

config = { "port": 8000 }

app.listen(config["port"], () => {
	console.log(`Backend running on ${config["port"]}`)
});
