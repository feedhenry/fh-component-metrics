var assert = require('assert');
var sinon = require('sinon');
var types = require('lib/types');

var redisClientStub = {
  multi: sinon.stub()
};

var redisClient = require('lib/clients/redis');

exports.test_redis_client_success = function(done) {
  var client = redisClient.init({redisClient: redisClientStub, namespace: 'testredis'});
  var metricKey = "test-redis-metric";
  redisClientStub.multi.returns({exec: function(cb){
    return cb();
  }});
  client.send({key: metricKey, tags: {workerId: 1}, fields: {value: 2}, timestamp: Date.now()});
  setTimeout(function(){
    assert.ok(redisClientStub.multi.calledOnce);
    var argInCall = redisClientStub.multi.args[0][0];
    assert.equal(argInCall.length, 2);
    assert.equal(argInCall[0][1], 'testredis:' + metricKey);
    assert.equal(typeof argInCall[0][2], 'string');
    done();
  }, 10);
};


