const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
exports.url = 'mongodb://localhost:27017'

// Database Name
exports.dbName = 'TMC_wiki'


function insertDocument(db, object, name, callback){
    // Get the documents collection
    const collection = db.collection(name);
    // Insert some documents
    collection.insertOne(
        object
    , function(err, result) {
        if(err){console.log(err); return}
        // assert.equal(3, result.result.n);
        // assert.equal(3, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(result);
    });
}

exports.insertDocument = insertDocument

async function findAllDocuments(db, name, callback){
    // Get the documents collection
    const collection = db.collection(name);
    // Find some documents
    collection.find().toArray(function(err, docs) {
        if(err){console.log(err); return}
        console.log("Found the all " + name);
        callback(docs);
    });
}

exports.findAllDocuments = findAllDocuments;