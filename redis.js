const redis = require('redis');
const redisClient = redis.createClient(6379, '192.168.99.100');

redisClient.on('connect', function (err, response) {
    console.log("Connected to redis");
});

module.exports = redisClient;