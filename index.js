var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var _ = require('lodash');
var async = require('async');
var foreach = require('foreach');
var arrayEach = require('array-each');

async.timesSeries(
  15,
  function(t, next) {
    var count = Math.pow(2, t);
    var suite = new Benchmark.Suite(`${count} array.length`);

    var array = _.times(count, function(t) {
      return t;
    });
    
    var callbackSync = function(value, index) { value; };
    var callbackAsync = function(value, index, next) {
      value;
      next();
    };

    suite.add('for', function() {
      for (var i = 0; i < count; i++) {
        array[i];
      };
    });
    var forFunctionalWrapped = function(array, callback) {
      for (var i = 0; i < count; i++) {
        callback(array[i]);
      };
    };
    suite.add('for functional wrapped', function() {
      forFunctionalWrapped(array, function() {});
    });
    
    var evalFor;
    eval(`evalFor = (array) => { for (var i = 0; i < count; i++) { array[i]; } };`);
    suite.add('evalFor', function() { evalFor(array); });
    
    suite.add('while', function() {
      var i = 0;
      while (i < count) {
        array[i];
        i++;
      }
    });
    suite.add('for-in', function() {
      for (var i in array) {
        array[i];
      }
    });
    suite.add('for-of', function() {
      for (var f of array) {
        f;
      }
    });
    suite.add('forEach', function() {
      array.forEach(callbackSync);
    });
    suite.add('lodash@4.17.10 forEach', function() {
      _.forEach(array, callbackSync);
    });
    suite.add('async@2.6.1 forEachOf', function() {
      async.forEachOf(array, callbackAsync);
    });
    suite.add('async@2.6.1 forEachOfSeries', function() {
      async.forEachOfSeries(array, callbackAsync);
    });
    suite.add('foreach@2.0.5', function() {
      foreach(array, callbackSync);
    });
    suite.add('array-each@1.0.1', function() {
      arrayEach(array, callbackSync);
    });

    tb.wrapSuite(suite, () => next());
    suite.run({ async: true });
  }
);
