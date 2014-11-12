var assert = require('assert') 
  , config = require('../config')
  , fixtures = require('./fixtures')
  , server = require('../server');

before(function(done) {
    fixtures.reset(function(err) {
        assert(!err); 
        done();
    });
});
