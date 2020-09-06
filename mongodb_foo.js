const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
exports.url = 'mongodb://localhost:27017'
//exports.url = this.url

// Database Name
exports.dbName = 'TMC_wiki'
//exports.dbName = this.dbName

// Create a new MongoClient
exports.client = new MongoClient(this.url)
//exports.client = this.client

function insertDocument(db, object, name, callback){
    // Get the documents collection
    const collection = db.collection(name);
    // Insert some documents
    collection.insertOne(
        object
    , function(err, result) {
        assert.equal(err, null);
        // assert.equal(3, result.result.n);
        // assert.equal(3, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(result);
    });
}
exports.insertDocument = insertDocument;