var express = require('express');
var db = require('./db');

var router = express.Router();

router.get('/', function(req, res) {
  db.connection().collection('jobexe').find().toArray(function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
