// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
 
// // Connection URL
// const url = 'mongodb://localhost:27017';
 
// // Database Name
// const dbName = 'data-store';
 
// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server"); 
//   const db = client.db(dbName);

//   db.createCollection("file-store", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     //db.close();
//   });
//   client.close();
// });

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/data-store");