var express = require('express');
var db = require('./db');
var notifier = require('./notifier');

var router = express.Router();

router.get('/:unit', function(req, res) {
  var query = {"unit":req.params.unit};
  if (req.query.state) query.state = req.query.state;
  db.connection().collection('jobexe').find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result.length == 0 && req.query.wait) {
      notifier.addObserver(req.params.unit, function() {
        db.connection().collection('jobexe').find(query).toArray(function(err2, result2) {
          if (err2) throw err2;
          res.send(result2);
        });
      });
    } else {
      res.send(result);
    }
  });
});

router.delete('/:unit', function(req, res) {
  db.connection().collection('jobexe').deleteMany({"unit":req.params.unit}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.get('/:unit/:name(*)', function(req, res) {
  var query = {"unit":req.params.unit, "name":req.params.name};
  db.connection().collection('jobexe').findOne(query, function(err, job) {
    if (req.query.set) {
      if (!job) job = {
        "unit":req.params.unit,
        "name":req.params.name
      };
      job.state = req.query.set;
      job.lastmodified = Date.now();
      db.connection().collection('jobexe').update(query, job, {upsert:true});
      if (req.query.set == "pending") notifier.notifyObservers(req.params.unit);
    }
    res.send(job);
  });
});

router.delete('/:unit/:name(*)', function(req, res) {
  var query = {"unit":req.params.unit, "name":req.params.name};
  db.connection().collection('jobexe').deleteMany(query, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
