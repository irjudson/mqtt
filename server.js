var config = require('./config')
  , mqtt = require('mqtt')
  , nitrogen = require('nitrogen');

var service = new nitrogen.Service(config);

var FAILURE = 1;
var SUCCESS = 0;

var mqttServer = mqtt.createServer(function(client) {

    client.on('connect', function(packet) {
        if (!packet.username || !packet.password)
            return client.connack({ returnCode: 1 });

        var principal = new nitrogen.Device({
            accessToken: {
                token: packet.password
            },
            id: packet.username,
            nickname: packet.username
        });

        service.resume(principal, function(err, session, principal) {
            if (err || !session) return client.connack({ returnCode: FAILURE });

            client.principal = principal;
            client.session = session;

            return client.connack({ returnCode: SUCCESS });
        });
    });

    client.on('publish', function(packet) {
        var message = new nitrogen.Message(JSON.parse(packet.payload));
        message.send(client.session, function(err, message) {
            if (err) return client.puback({ returnCode: FAILURE });
        });
    });

    client.on('subscribe', function(packet) {
        packet.subscriptions.forEach(function(subscription) {
            var filter = JSON.parse(subscription.topic);
            client.session.onMessage(filter, function(message) {
                client.publish({
                    topic: subscription.topic,
                    payload: JSON.stringify(message)
                });
            });
        });

        //client.suback(packet.messageId);
    });

    client.on('pingreq', function(packet) {
        client.pingresp();
    });

    client.on('disconnect', function(packet) {
        client.session.stop();
    });

}).listen(config.mqtt_port);