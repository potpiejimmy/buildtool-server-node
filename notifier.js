var observers = {};

function addObserver(key, observer) {
  if (!(key in observers)) observers[key] = [];
  observers[key].push(observer);
}

function notifyObservers(key, observer) {
  if (key in observers) {
    observers[key].forEach(function(element) {
      element();
    });
    delete observers[key];
  }
}

module.exports.addObserver = addObserver;
module.exports.notifyObservers = notifyObservers;
