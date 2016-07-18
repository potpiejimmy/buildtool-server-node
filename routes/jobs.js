var express = require('express');
var db = require('../util/db');
var notifier = require('../util/notifier');

var router = express.Router();

function getJobExes(req, res, query) {
  db.connection().collection('jobexe').find(query).toArray(function(err, result) {
    if (err) throw err;
    if (result.length == 0 && req.query.wait) {
      notifier.addObserver(req.params.unit.toLowerCase(), function() {
        getJobExes(req, res, query);
      });
    } else {
      res.send(result);
    }
  });
}

router.get('/:unit', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase()};
  if (req.query.state) query.state = req.query.state;
  getJobExes(req, res, query);
});

router.delete('/:unit', function(req, res) {
  db.connection().collection('jobexe').deleteMany({"unit":req.params.unit.toLowerCase()}, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

router.get('/:unit/:name(*)', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  db.connection().collection('jobexe').findOne(query, function(err, job) {
    if (req.query.set) {
      if (!job) job = {
        "unit":req.params.unit.toLowerCase(),
        "name":req.params.name
      };
      job.state = req.query.set;
      job.lastmodified = Date.now();
      db.connection().collection('jobexe').update(query, job, {upsert:true});
      if (req.query.set == "pending") notifier.notifyObservers(req.params.unit.toLowerCase());
    }
    res.send(job);
  });
});

router.delete('/:unit/:name(*)', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  db.connection().collection('jobexe').deleteMany(query, function(err, result) {
    if (err) throw err;
    res.send(result);
  });
});

module.exports = router;
