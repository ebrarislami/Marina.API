var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://m20.cloudmqtt.com', {username: 'xvwpkpzb', password: 'NXGd_6_hESIy', port: 15833});
client.on('connect', function () {
    // client.subscribe('b98a6270-7def-11e8-8f4f-e57f63dd0aa7');
});
  
client.on('message', function (topic, message) {
    // console.log(topic)
});

module.exports = client;