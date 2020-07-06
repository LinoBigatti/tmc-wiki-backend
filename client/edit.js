const fetch = require('node-fetch');
const fs = require('fs');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const clientEdit = async (req, res) => {
	fetch(`http://localhost:${config["port"]}/__editPost__?id=${req.query.id}`)
		.then(response => response.json())
		.then(data => {
			res.send(  `<form action="/__editPost__?id=${req.query.id}" method="post">
							<label for="title">Title: </label><br/>
							<input id="title" type="text" name="title" value="${data.title}"><br/>
							<label for="body">Body: </label><br/>
							<input id="body" type="text" name="body" value="${data.body}"><br/>
							<label for="tags">Tags: </label><br/>
							<input id="tags" type="text" name="tags" value="${data.tags}"><br/>
							<label for="description">Description: </label><br/>
							<input id="description" type="text" name="description" value="${data.description}"><br/>
							<input type="submit" value="Post">
						</form>`)
		})
		.catch(err => res.send(err.toString()));
}
exports.clientEdit = clientEdit;