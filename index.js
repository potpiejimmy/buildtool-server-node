var express = require('express');

var db = require('./db');
var jobexe = require('./jobexe');

db.connect();

var app = express();

app.get('/', function (req, res) {
  res.send('Info: Root is <a href="/buildtool">/buildtool!</a>');
});

app.get('/buildtool', function (req, res) {
  res.send('Info: Jobs Resources at <a href="/buildtool/res/jobs/unit/">/buildtool/res/jobs/&lt;unit&gt;</a>');
});

app.use('/buildtool/res/jobs', jobexe);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
