// Post parser

const fs = require('fs');
const dir = './posts';
const mongodb_foo = require('./mongodb_foo.js');
const { client } = require('./mongodb_foo.js');

class Post {
	constructor(body, title, tags, desc) {
		this.body = body;
		this.title = title;
		this.tags = tags;
		this.desc = desc;
		this.time = new Date().toDateString();
		this.id;
	}
	get_time() {
		return this.time;
	}
	edit_time(newTime) {
		this.time = newTime;
	}
	save() {
		var _res;
		var object = {title: this.title, des: this.des, tags: this.tags, body: this.body}
		mongodb_foo.client.connect(function(err) {
			if(err){console.log(err); return}
			const db = mongodb_foo.client.db(mongodb_foo.dbName);
			console.log("Connected successfully to server");
	
			mongodb_foo.insertDocument(db, object, "posts", res => {
				_res = res.insertedId;
				console.log("Post saved correctly")
				mongodb_foo.client.close()
			})
		});
		this.id = _res;
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
	// console.log(postData);
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
	return fs.readFileSync(dir + '/' + id + '.json', 'utf8');
}
exports.getBody = getBody;