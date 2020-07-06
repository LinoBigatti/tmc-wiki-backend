// Post parser

const fs = require('fs');
const dir = './posts';

class Post {
	constructor(body, title, tags, desc) {
		this.body = body;
		this.title = title;
		this.tags = tags.split(';');
		this.desc = desc;
		this.id = fs.readdirSync(dir).length;
	}

	save() {
		fs.writeFile(dir + '/' + this.id + '.md', this.body, function(err) {
    		if(err) {
        		return console.log(err);
    		}

    		console.log("Post saved correctly");
		});

		var postMetadata = getPostMetadata();
		postMetadata[this.id - 1] = { "title": this.title, "id": this.id, "tags": this.tags, "description": this.desc};
		fs.writeFile('metadata.json', JSON.stringify(postMetadata), function(err) {
    		if(err) {
        		return console.log(err);
    		}

    		console.log("Metadata saved correctly");
		});
	}

	setId(id) {
		this.id = id;
	}
}
exports.Post = Post;

const getPostMetadata = () => {
	var postMetadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));

	return postMetadata;
}
exports.getPostMetadata = getPostMetadata;

const getPostData = () => {
	var postData = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
	console.log(postData);
	for(post in postData) {
		//post.body = getBody(post.id);
		postData[post].body = getBody(postData[post].id);
	}

	return postData;
}
exports.getPostData = getPostData;

const searchExactTitle = (title) => {
	var postMetadata = getPostMetadata();

	for(i in postMetadata) {
		post = postMetadata[i];
		
		if(post.title === title) {
			return i;
		}
	}
}
exports.searchExactTitle = searchExactTitle;

const getBody = (id) => {
	return fs.readFileSync(dir + '/' + id + '.md', 'utf8');
}
exports.getBody = getBody;