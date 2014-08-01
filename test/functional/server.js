var assert = require('assert')
  , config = require('../../config')
  , fixtures = require('../fixtures')
  , mqtt = require('mqtt');

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
        }, 2000);

        client.on('message', function (topic, message) {
            var messageObject = JSON.parse(message);
            assert(messageObject.body.temperature, 45.0);

            client.end();
            done();
        });
    });

});
