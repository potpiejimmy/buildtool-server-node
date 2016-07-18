var express = require('express');
var db = require('../util/db');

var router = express.Router();

router.get('/:unit/:name', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  db.connection().collection('unitparam').findOne(query, function(err, param) {
      if (err) throw err;
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

module.exports = router;