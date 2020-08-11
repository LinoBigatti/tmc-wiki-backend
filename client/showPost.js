const fetch = require('node-fetch');
const fs = require('fs');
const md = require('markdown-it')();

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const clientGet = async (req, res) => {
	fetch(`http://localhost:${config["port"]}/__getPost__id=${req.query.id}`)
		.then(response => response.json())
		.then(data => {
			response = 
				// `# ${data.title}
				// #### ${data.description}
				// ---
				// ${data.body}
				// ---
				// Tags: ${data.tags}`;

			res.send(md.render(response))
		})
		.catch(err => res.send(err.toString()));
}
exports.clientGet = clientGet;