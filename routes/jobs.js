var express = require('express');
var db = require('../util/db');
var Notifier = require('../util/notifier');
var pendingNotifier = new Notifier();
var changeNotifier = new Notifier();

var router = express.Router();

router.get('/', function(req, res) {
  db.connection().collection('jobexe').distinct('unit', function(err, result) {res.send(result);});
});

function getJobExes(req, res, query) {
  db.connection().collection('jobexe').find(query).sort({lastmodified:-1}).toArray(function(err, result) {
    if (err) throw err;
    if (result.length == 0 && req.query.wait) {
      // if empty result and wait=true is set, wait until a new pending entry arrives
      pendingNotifier.addObserver(req.params.unit.toLowerCase(), function() {
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
  if (req.query.waitForChange) {
    // if waitForChange=true is set, wait until notified about a change in data
    changeNotifier.addObserver(req.params.unit.toLowerCase(), function() {
      getJobExes(req, res, query);
    })
  } else {
    getJobExes(req, res, query);
  }
});

router.delete('/:unit', function(req, res) {
  db.connection().collection('jobexe').deleteMany({"unit":req.params.unit.toLowerCase()}, function(err, result) {
    if (err) throw err;
    changeNotifier.notifyObservers(req.params.unit.toLowerCase());
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
      // notify listeners about new pending entry
      if (req.query.set == "pending") pendingNotifier.notifyObservers(req.params.unit.toLowerCase());
      // and about an overall change in data
      changeNotifier.notifyObservers(req.params.unit.toLowerCase());
    }
    res.send(job);
  });
});

router.delete('/:unit/:name(*)', function(req, res) {
  var query = {"unit":req.params.unit.toLowerCase(), "name":req.params.name};
  db.connection().collection('jobexe').deleteMany(query, function(err, result) {
    if (err) throw err;
    changeNotifier.notifyObservers(req.params.unit.toLowerCase());
    res.send(result);
  });
});

module.exports = router;
