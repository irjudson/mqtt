var assert = require('assert')
  , config = require('../../config')
  , fixtures = require('../fixtures')
  , mqtt = require('mqtt')
  , nitrogen = require('nitrogen');

describe('bridge', function() {

    it('should be able to publish message and receive it back', function(done) {
        var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
            'username': fixtures.fixtures.principalId,
            'password': fixtures.fixtures.accessToken
        });

        var topic = JSON.stringify({
            type: 'temperature'
        });

        client.subscribe(topic);

        setTimeout(function() {
            client.publish('messages', JSON.stringify({
                type:'temperature',
                body: {
                    temperature: 45.0
                }
            }));
        }, 1000);

        client.on('message', function (topic, message) {
            var messageObject = JSON.parse(message);
            assert(messageObject.body.temperature, 45.0);

            client.end();
            done();
        });
    });

    it('should be able to send message from non-gatewayed principal and receive it on subscribed gatewayed MQTT device', function(done) {
        var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
            'username': fixtures.fixtures.principalId,
            'password': fixtures.fixtures.accessToken
        });

        var topic = JSON.stringify({
            to: fixtures.fixtures.principalId
        });

        client.subscribe(topic);

        setTimeout(function() {
            var user = new nitrogen.User({
                nickname: 'user',
                email: process.env.NITROGEN_EMAIL,
                password: process.env.NITROGEN_PASSWORD
            });

            var service = new nitrogen.Service(config);
            service.authenticate(user, function(err, session, user) {
                assert(!err);
                assert(session);

                new nitrogen.Message({
                    type:'_command',
                    to: fixtures.fixtures.principalId,
                    body: {
                        doit: true
                    }
                }).send(session, function(err) {
                    assert(!err);
                });
            });
        }, 1000);

        client.on('message', function (topic, message) {
            var messageObject = JSON.parse(message);
            assert(messageObject.type, "_command");

            client.end();
            done();
        });
    });

});
