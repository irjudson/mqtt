var async = require('async')
  , assert = require('assert')
  , config = require('../../config')
  , nitrogen = require('nitrogen');

var service = new nitrogen.Service(config);

var createPrincipal = function(callback) {
    var principal = new nitrogen.Device({
        api_key: config.api_key,
        nickname: 'test'
    });

    service.connect(principal, function(err, session, principal) {
        assert(!err);
        assert(session);

        fixtures.principalId = principal.id;
        fixtures.accessToken = session.accessToken.token;

        return callback();
    });
};

exports.reset = function(callback) {
    console.log('reset');
    createPrincipal(callback);
};

var fixtures = {};

exports.fixtures = fixtures;