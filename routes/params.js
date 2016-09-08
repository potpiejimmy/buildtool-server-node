var express = require('express');
var db = require('../util/db');

var router = express.Router();

router.get('/', function(req, res) {
  db.connection().collection('unitparam').find().toArray(function(err, param) {
      if (err) return res.send(err);
      res.send(param);
  });
});

router.get('/:unit/:name', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  db.connection().collection('unitparam').findOne(query, function(err, param) {
      if (err) return res.send(err);
      res.send(param);
  });
});

router.post('/:unit/:name', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  var param = req.body;
  param.unit = req.params.unit.toLowerCase();
  param.name = req.params.name;
  db.connection().collection('unitparam').update(query, param, {upsert:true});
  res.send(param);
});

router.delete('/:unit/:name', function(req, res) {
  var query = {"unit":req.params.unit, "name":req.params.name};
  db.connection().collection('unitparam').deleteMany(query, function(err, result) {
    if (err) return res.send(err);
    res.send(result);
  });
});

module.exports = router;