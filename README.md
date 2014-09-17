# Nitrogen MQTT Bridge

The MQTT bridge allows lower capability devices that can only send or recieve MQTT messages to participate in the Nitrogen ecosystem.

## Running the bridge:

1. Clone or fork this repo: `https://github.com/nitrogenjs/service`
2. Fetch and install its node.js dependencies: `npm install`
3. Edit `config.js` to change defaults as necessary.
4. `npm start`

## Provisioning a device

To provision a device to use the MQTT gateway:
1. Create the device with the command line tool:

`> n2 principal create --type device --name 'my device' --apiKey 'API KEY HERE'`

The ID of the created device is the username that this device should use to authenticate with the service.

2. Provision a long lived access token for the device using the command line tool:

`> n2 principal accesstoken <device_id>`

This will create a long lived accesstoken with the service that should be used as the password during MQTT authentication.  For example, using the 'mqtt' module in node.js, interacting with the gateway would look something like this:

``` javascript
var client = mqtt.createClient(config.mqtt_port, config.mqtt_host, {
    'username': principalId,
    'password': accessToken
});

var topic = JSON.stringify({
    type: 'temperature'
});

client.subscribe(topic);

client.on('message', function (topic, messageText) {
    var message = JSON.parse(messageText);

    // do something with the message
});

client.publish('messages', JSON.stringify({
    type:'temperature',
    body: {
        temperature: 45.0
    }
}));
```

## Running tests

1. `npm test`

## Nitrogen Project

The Nitrogen project is housed in a set of GitHub projects:

1. [service](https://github.com/nitrogenjs/service): Core platform responsible for managing principals, security, and messaging.
2. [client](https://github.com/nitrogenjs/client): JavaScript client library for building Nitrogen devices and applications.
3. [admin](https://github.com/nitrogenjs/admin): Web admin tool for working with the Nitrogen service.
4. [devices](https://github.com/nitrogenjs/devices): Device principals for common pieces of hardware.
5. [commands](https://github.com/nitrogenjs/commands): CommandManagers and schemas for well known command types.
6. [cli](https://github.com/nitrogenjs/cli): Command line interface for working with the Nitrogen service.
7. [reactor](https://github.com/nitrogenjs/reactor): Always-on hosted application execution platform.
8. [apps](https://github.com/nitrogenjs/apps): Project maintained Nitrogen applications.