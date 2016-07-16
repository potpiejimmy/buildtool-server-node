var express = require('express');
var bodyParser = require('body-parser')

var db = require('./util/db');

var jobs = require('./routes/jobs');
var params = require('./routes/params');

db.connect();

var app = express();

app.use(bodyParser.json());
app.use('/buildtool/res/jobs', jobs);
app.use('/buildtool/res/params', params);

app.get('/', function (req, res) {
  res.send('Resources at:<br/>/buildtool/res/jobs/&lt;unit&gt;/&lt;job&gt;<br/>/buildtool/res/params/&lt;unit&gt;/&lt;param&gt;');
});

app.listen(3002, function () {
  console.log('Buildtool server listening on port 3002.');
});
