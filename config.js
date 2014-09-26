var Store = require('nitrogen-memory-store');

var config = {
    host: 'localhost',
    http_port: 3030,
    protocol: 'http',

    api_key: process.env.API_KEY,
    
    mqtt_port: 1883
};

config.store = new Store(config);

module.exports = config;
