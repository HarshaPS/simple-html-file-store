const express = require('express');
const app = express();
const router = require('./routes');
const bodyParser = require('body-parser');
const port = 8000; 
const MongoDbClient = require('./db-client/mongoDbClient');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));

app.use('/api', router);

app.listen(port);
console.log('server is running on ' + port);