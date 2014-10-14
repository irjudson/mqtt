var assert = require('assert')
  , config = require('./config')
  , mqtt = require('mqtt');

var deviceId = process.env.DEVICE_ID || '54357f8a47b5a7f3095fcca4';
var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
    'username': deviceId,
    'password': process.env.DEVICE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDM1N2Y4YTQ3YjVhN2YzMDk1ZmNjYTQiLCJpYXQiOjE0MTI3OTIyMjQsImV4cCI6MTQxMjg3ODYyNH0.m7BZMvkFJIvnMTz2ZbMvPduJikOYok-OJmId5eIWMek'
});

var subscription = '{"to": \"'+deviceId+'\" }';
client.subscribe(subscription);

setInterval(function() {
    console.log('Sending telemetry data (the temperature).');
    client.publish(subscription, JSON.stringify({
        type:'_command',
        body: {
           temperature: 45.1
        }
    }));
}, 10000);

client.on('message', function (topic, message) {
    var messageObject = JSON.parse(message);
    console.log(messageObject.body.temperature);
    assert(messageObject.body.temperature, 45.1);
});
