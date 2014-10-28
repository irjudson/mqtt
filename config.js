var Store = require('nitrogen-memory-store');

var config = {
    host: process.env.HOST_NAME || 'api.nitrogen.io',
    http_port: process.env.PORT || 443,
    protocol: process.env.PROTOCOL || 'https',
    api_key: process.env.API_KEY,
    mqtt_host: process.env.MQTT_HOST_NAME || 'localhost',
    mqtt_port: 1883,
    log_levels: [ "debug", "info", "warn", "error" ]
};

config.store = new Store(config);

module.exports = config;
