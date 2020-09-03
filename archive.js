/*
Litematic archive handling
*/

const fs = require('fs');

const index = (req, res) => {
	var lsFiles = fs.readdirSync('./archive/');
	
	/*var response = 	`
					<style>
					table, th, td {
  						border: 1px solid black;
  						border-collapse: collapse;
  						padding: 5px;
					}

					button {
						position: fixed;
						bottom: 5px;
						right: 5px;
						margin: 0;
						padding: 5px 3px;
					}
					</style>

					<a href="/archive-upload">
    					<button type="button">
      						<b> UPLOAD </b>
    					</button>
					</a>

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
					`*/
	var response = {}

	lsFiles.forEach(file => {
		if(file == '.nodelete') {
			return;
		}
		var stats= fs.statSync(`./archive/${file}`);

		name = file;
		size = stats.size;
		created = stats.ctime;

		/*response +=	`
					<tr>
    					<td>${name}</td>
    					<td>${size / 1000}Kb</td>
    					<td>${created.toISOString()}</td>
    					<td>
    						<a href="/archive/${name}">
    							Click here
    						</a>
    					</td>
  					</tr>
  					`*/
  		response[name] = { 	'name': name, 
  							'size': size / 1000, 
  							'created': created.toISOString(), 
  							'link': `/archive/${name}` }
	});
	/*response +=	`
				</tbody>
				</table>
				`*/

	res.send(response);
}
exports.index = index;

const download = (req, res) => {
	res.download(`.${req.url}`);
}
exports.download = download;

const uploadForm = (req, res) => {
	res.send(	`
				<style>
					button {
						position: fixed;
						bottom: 5px;
						right: 5px;
						margin: 0;
						padding: 5px 3px;
					}
				</style>

				<a href="/archive">
    				<button type="button">
      					<b> GO BACK </b>
    				</button>
				</a>

				<h1>Upload a litematic.</h1> 
   				
    			<form action="/__archive-upload__" enctype="multipart/form-data" method="POST"> 
					<span>Upload your file:</span>   
        			<input type="file" name="litematic" required/> <br> 
        			<input type="submit" value="submit">  
    			</form> 
			 	`);
}
exports.uploadForm = uploadForm;

const uploadProcess = (req, res) => {
	var litematic = req.files.litematic;
	litematic.mv(`./archive/${litematic.name}`);

	res.redirect('/archive');
}
exports.uploadProcess = uploadProcess;