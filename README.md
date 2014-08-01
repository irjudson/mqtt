# Nitrogen MQTT Bridge

The MQTT bridge allows devices that can send or recieve MQTT messages to participate in the Nitrogen ecosystem.

It establishes an MQTT endpoint that these clients can publish and subscribe to messages from.

## Running the bridge:

1. Clone or fork this repo: `https://github.com/nitrogenjs/service`
2. Fetch and install its node.js dependencies: `npm install`
3. Edit `config.js` to change defaults as necessary.
4. `npm start`

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