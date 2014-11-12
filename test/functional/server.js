var assert = require('assert')
  , config = require('../../config')
  , fixtures = require('../fixtures')
  , mqtt = require('mqtt')
  , nitrogen = require('nitrogen');

describe('MQTT bridge', function() {

    it('should be able to publish message and receive it back', function(done) {
        this.timeout(10000);
        var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
            'username': fixtures.fixtures.principalId,
            'password': fixtures.fixtures.accessToken
        });

        var subscription = '{"to": \"'+fixtures.fixtures.principalId+'\" }';
        client.subscribe(subscription);

        setInterval(function() {
            console.log('Sending telemetry data (the temperature).');
            client.publish(subscription, JSON.stringify({
                to: fixtures.fixtures.principalId,
                type:'_command',
                body: {
                   temperature: 45.0
                }
            }));
        }, 1000);

        client.on('message', function (topic, message) {
            var messageObject = JSON.parse(message);
            assert(messageObject.temperature, 45.0);
            done();
        });
    });

    // it('should be able to send message from non-gatewayed principal and receive it on subscribed gatewayed MQTT device', function(done) {
    //     var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
    //         'username': fixtures.fixtures.principalId,
    //         'password': fixtures.fixtures.accessToken
    //     });

    //     var subscription = '{"to": \"'+fixtures.fixtures.principalId+'\" }';

    //     client.subscribe(subscription);

    //     setTimeout(function() {
    //         var user = new nitrogen.User({
    //             nickname: 'user',
    //             email: process.env.NITROGEN_EMAIL,
    //             password: process.env.NITROGEN_PASSWORD
    //         });

    //         var service = new nitrogen.Service(config);
    //         service.authenticate(user, function(err, session, user) {
    //             assert(!err);
    //             assert(session);

    //             new nitrogen.Message({
    //                 type:'_command',
    //                 to: fixtures.fixtures.principalId,
    //                 body: {
    //                     doit: true
    //                 }
    //             }).send(session, function(err) {
    //                 assert(!err);
    //             });
    //         });
    //     }, 1000);

    //     client.on('message', function (topic, message) {
    //         var messageObject = JSON.parse(message);
    //         console.log(message);
    //         assert(messageObject.type, "_command");

    //         client.end();
    //         done();
    //     });
    // });

});
