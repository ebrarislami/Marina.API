const redis = require('redis');
const rclient = redis.createClient();

rclient.on('connect', function (err, response) {
    console.log("Connected to redis");
});

module.exports = rclient;