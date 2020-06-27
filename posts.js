// Post parser

const fs = require('fs');
const dir = './posts';

module.exports = class Post {
	constructor(body) {
		this.body = body;
		this.id = fs.readdirSync(dir).length;
	}

	save() {
		fs.writeFile(dir + '/' + this.id + '.md', this.body, function(err) {
    		if(err) {
        		return console.log(err);
    		}

    		console.log("Post saved correctly");
		}); 
	}
}