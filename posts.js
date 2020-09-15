// Post parser

const fs = require('fs');
const dir = './posts';
const mongodb_foo = require('./mongodb_foo.js');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

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
	static editbyId(id, body, title, tags, desc){
		var client = new MongoClient(mongodb_foo.url)
		var object = {title: title, desc: desc, tags: tags, last_edited: new Date().toDateString(), body: body}
		client.connect(function(err) {
			if(err){console.log(err); return}
			const db = client.db(mongodb_foo.dbName);
			console.log("Connected successfully to server");
	
			mongodb_foo.editDocumentById(db, id, object, "posts", res => {
				console.log("Post saved correctly")
				client.close()
			})
		});
	}
	save() {
		var client = new MongoClient(mongodb_foo.url)
		var _res;
		var object = {title: this.title, desc: this.desc, tags: this.tags, last_edited: this.time, body: this.body}
		client.connect(function(err) {
			if(err){console.log(err); return}
			const db = client.db(mongodb_foo.dbName);
			console.log("Connected successfully to server");
	
			mongodb_foo.insertDocument(db, object, "posts", res => {
				_res = res.insertedId;
				console.log("Post saved correctly")
				client.close()
			})
		});
		this.id = _res;
	}
}
exports.Post = Post;

const getPostMetadata = (callback) => {
	var client = new MongoClient(mongodb_foo.url)
	client.connect(function (err) {
		if(err){console.log(err); return}
		const db = client.db(mongodb_foo.dbName);
		console.log("Connected successfully to server");

		mongodb_foo.findAllDocuments(db, "posts", res => {
			client.close()
			callback(res)
		})
	});
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