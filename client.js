var assert = require('assert')
  , config = require('./config')
  , mqtt = require('mqtt');

var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
    'username': '5434865d96d383fa164794e2',
    'password': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDM0ODY1ZDk2ZDM4M2ZhMTY0Nzk0ZTIiLCJpYXQiOjE0MTI3Mjg2NzUsImV4cCI6MTQxMjgxNTA3NX0.FRvupjLl1aLK1X4n2w2kn9w6nMH5VGeo5ka9ZSuzAlY'
});

var topic = JSON.stringify({
    type: 'temperature'
});

client.subscribe(topic);

setTimeout(function() {
    console.log('publishing');
    client.publish('messages', JSON.stringify({
        type:'temperature',
        body: {
            temperature: 45.0
        }
    }));
}, 2000);

client.on('message', function (topic, message) {
    console.log('received: ' + message);
    var messageObject = JSON.parse(message);
    assert(messageObject.body.temperature, 45.0);

    client.end();
});
