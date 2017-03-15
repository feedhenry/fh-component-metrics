var gauge = require('./gauge');
var types = require('./types');
var MetricsClients = require('./clients');
var _ = require('lodash');

module.exports = function(component, metrics_conf) {
  var config = require('./config')(metrics_conf);
  var clients = new MetricsClients(config.getConfig());
  var timeFunc = gauge(clients, types.T);

  return function(req, res, next) {
    if (config.enabled()) {
      var start = process.hrtime();
      res._end = res.end;
      res.end = function(data, encoding, callback) {
        res._end(data, encoding, callback);
        var hrTime = process.hrtime(start);
        var millisecondsTaken = (hrTime[0] * 1000) + (hrTime[1] / 1000000);

        var route = req.permissionpath || req.route || req.path || req.url;
        if (_.isObject(route)) {
          route = route.path;
        }
        if ('string' === typeof route) {
          timeFunc(component + '_api_timing', {route: route}, millisecondsTaken);
        } else {
          /*eslint-disable no-console */
          console.error("failed to determine route cannot gauge timing : fh-component-metrics");
        }
      };
      return next();
    } else {
      return next();
    }
  };
};
