var assert = require('assert');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var types = require('lib/types');

var messageSent = false;
var socketStub = sinon.stub();
var statsdClient = proxyquire('lib/clients/statsd.js', {
  dgram: {
    createSocket: function() {
      return {
        send: socketStub
      };
    }
  }
});

exports.test_buildStatsDMessages = function(done) {
  var client = statsdClient.init({});
  var data = {
    type: types.G,
    key: 'test-metrics-key',
    tags: {
      'a': 'b',
      'e': 3
    },
    fields: {
      'c': 1,
      'd': 2
    }
  };

  var messages = client.buildMessages(data);
  assert.equal(messages.length, 2);
  assert.ok(messages.indexOf('test-metrics-key-a_is_b-e_is_3-c:1|g') > -1);
  assert.ok(messages.indexOf('test-metrics-key-a_is_b-e_is_3-d:2|g') > -1);
  done();
};

exports.test_customise_key_builder = function(done) {
  var client = statsdClient.init({
    keyBuilder: function(key, tags, field) {
      return [key, tags.name, field].join(';');
    }
  });
  var data = {
    type: types.G,
    key: 'test-key-builder',
    tags: {
      name: 'a',
      another: 'b'
    },
    fields : {
      'c': '1'
    }
  };
  var messages = client.buildMessages(data);
  assert.equal(messages.length, 1);
  assert.equal(messages[0], "test-key-builder;a;c:1|g");
  done();
};

exports.test_statsDSend = function(done) {
  socketStub.yieldsAsync();
  var client = statsdClient.init({});
  client.send({key:'testKey', fields:{'a': 1}});
  setTimeout(function() {
    assert.ok(socketStub.calledOnce);
    done();
  }, 10);
};