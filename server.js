var config = require('./config')
  , mqtt = require('mqtt')
  , nitrogen = require('nitrogen');

var service = new nitrogen.Service(config);

var FAILURE = 1;
var SUCCESS = 0;

var mqttServer = mqtt.createServer(function(client) {

    var self = this;
    if (!self.clients) self.clients = {};

    client.on('connect', function(packet) {
        // console.log(packet);
        if (!packet.username || !packet.password) return client.connack({ returnCode: 1 });            
        
        self.clients[packet.clientId] = client;
        client.id = packet.clientId;
        client.subscriptions = [];

        var deviceConfig = {
            name: packet.clientId,
            nickname: packet.username,
            tags: ['sends:telemetry'],
            api_key: process.env.API_KEY
        };
        console.log("New Device: " + JSON.stringify(deviceConfig));
        var principal = new nitrogen.Device(deviceConfig);

        service.connect(principal, function(err, session, principal) {
            if (err || !session) {
                console.log("Returning error #2");
                console.log("Error: " + err);
                console.log("Session: " + session);
                return client.connack({ returnCode: 1 });
            }

            client.principal = principal;
            client.session = session;

            return client.connack({ returnCode: SUCCESS });
        });
    });

    client.on('subscribe', function(packet) {
        var granted = [];

        console.log("SUBSCRIBE(%s): %j", client.id, packet);

        var message = new nitrogen.Message({
            // This is a horrible hack to map topics to message types, but hey. IRJ
            type: "_mqtt-gw",
            body: {
                payload: packet
            }});
        message.send(client.session, function(err, message) {
            if (err != null) {
                console.log("Error publishing message: " + err);   
                return client.puback({ returnCode: FAILURE });             
            }
        });

        for (var i = 0; i < packet.subscriptions.length; i++) {
          var qos = packet.subscriptions[i].qos
            , topic = packet.subscriptions[i].topic
            , reg = new RegExp(topic.replace('+', '[^\/]+').replace('#', '.+') + '$');

          granted.push(qos);
          client.subscriptions.push(reg);
        }

        client.suback({messageId: packet.messageId, granted: granted});
    });

    client.on('publish', function(packet) {
        console.log("PUBLISH(%s): %j", client.id, packet);
        var message = new nitrogen.Message({
            // This is a horrible hack to map topics to message types, but hey. IRJ
            type: "_mqtt-gw",
            body: {
                payload: packet
            }});
        message.send(client.session, function(err, message) {
            if (err != null) {
                console.log("Error publishing message: " + err);   
                return client.puback({ returnCode: FAILURE });             
            }
        });
        for (var k in self.clients) {
          var c = self.clients[k];

          for (var i = 0; i < c.subscriptions.length; i++) {
            var s = c.subscriptions[i];

            if (s.test(packet.topic)) {
              c.publish({topic: packet.topic, payload: packet.payload});
              break;
            }
          }
        }
    });

    client.on('pingreq', function(packet) {
        client.pingresp();
    });

    client.on('disconnect', function(packet) {
        client.stream.end();
    });
    client.on('close', function(packet) {
        delete self.clients[client.id];
    });
    client.on('error', function(e) {
        client.stream.end();
        console.log(e);
    });
}).listen(config.mqtt_port);
