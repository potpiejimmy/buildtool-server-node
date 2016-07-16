var MongoClient = require('mongodb').MongoClient;

var db;

module.exports.connect = function() {
    MongoClient.connect('mongodb://localhost:27017/buildtool', function(err, d) {
        if (err) throw err;
        db = d;
        console.log("DB connected.");
    });
}

module.exports.connection = function() {
    return db;
};
