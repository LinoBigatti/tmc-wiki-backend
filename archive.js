/*
Litematic archive handling
*/

const fs = require('fs');

const index = (req, res) => {
	var lsFiles = fs.readdirSync('./archive/');
	
	var response = 	`
					<table>
					<thead>
  						<tr>
    						<th>Name</th>
    						<th>Size</th>
    						<th>Created</th>
    						<th>Download</th>
  						</tr>
					</thead>
					<tbody>
					`

	lsFiles.forEach(file => {
		var stats= fs.statSync(`./archive/${file}`);

		name = file;
		size = stats.size;
		created = stats.ctime;

		response +=	`
					<tr>
    					<td>${name}</td>
    					<td>${size}</td>
    					<td>${created}</td>
    					<td>Click here</td>
  					</tr>
  					`
	});
	response +=	`
				</tbody>
				</table>
				`

	res.send(response);
}
exports.index = index;