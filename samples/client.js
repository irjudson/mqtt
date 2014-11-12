var assert = require('assert')
  , config = require('../config')
  , mqtt = require('mqtt');

var deviceId = process.env.DEVICE_ID || '5462ae6b5ad8efad0443b99f';
var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
    'username': deviceId,
    'password': process.env.DEVICE_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDYyYWU2YjVhZDhlZmFkMDQ0M2I5OWYiLCJpYXQiOjE0MTU3NTY3NjYsImV4cCI6MTQxNTg0MzE2Nn0.GSFFpWTe_VqgkG2hcIqDwFk_UScS2_RQzRy2BmECDjE'
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
