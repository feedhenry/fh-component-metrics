var async = require('async');

/**
 * A base implementation for all the clients
 */
var BaseClient = function BaseClient(opts) {
  this.opts = opts || {};
  var self = this;
  this.sendQConcurrency = opts.sendQueueConcurrency || 5;
  this.sendQ = async.queue(function(data, cb) {
    self.doSend(data, cb);
  }, this.sendQConcurrency);
};

//convert the data json object to an array of strings
BaseClient.prototype.buildMessages = function(/** data */) {
  throw new Error('not implemented');
};

//implement how the messages should be sent
BaseClient.prototype.transport = function(/** message, options, cb */) {
  throw new Error('not implemented');
};

BaseClient.prototype.doSend = function(data, cb) {
  var self = this;
  var messages;
  try {
    messages = this.buildMessages(data);
  } catch(e) {
    return cb(e);
  }
  async.each(messages, function(message, callback) {
    try {
      message = new Buffer(message);
      self.transport(message, self.opts, callback);
    } catch (e) {
      return callback(e);
    }
  }, cb);
};

BaseClient.prototype.send = function(data) {
  this.sendQ.push(data);
};

module.exports = BaseClient;