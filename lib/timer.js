var gauge = require('./gauge');
var types = require('./types');

module.exports = function(metricsClients) {

  var g = gauge(metricsClients, types.T);

  return function(key, tags, value, cb) {
    g(key, tags, value, cb);
  }
};