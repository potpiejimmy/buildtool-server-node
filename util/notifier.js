/* Constructor */
function Notifier() {
    this.observers = {};
}

Notifier.prototype.addObserver = function(key, observer) {
  if (!(key in this.observers)) this.observers[key] = [];
  this.observers[key].push(observer);
}

Notifier.prototype.notifyObservers = function(key, observer) {
  if (key in this.observers) {
    this.observers[key].forEach(function(element) {
      element();
    });
    delete this.observers[key];
  }
}

module.exports = Notifier;
