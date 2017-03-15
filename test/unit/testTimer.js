var assert = require('assert');
var types = require('../../lib/types');

var clientsMock =  {
  send: function(){}
};

var timer = require('../../lib/timer')(clientsMock);

exports.test_timer_ok = function(done) {
  timer('testTimer', null, 1000, function(err, data){
    assert.ok(!err);
    assert.ok(data.type, types.T);
    assert.ok(data.hasOwnProperty('key'));
    assert.ok(data.key, 'testTimer');
    assert.ok(data.hasOwnProperty('fields'));
    assert.equal(data.fields.value, 1000);
    done();
  });
};