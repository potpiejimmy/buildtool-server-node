var express = require('express');

var db = require('./db');
var jobexe = require('./jobexe');

db.connect();

var app = express();

app.use('/jobs', jobexe);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
