var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://m20.cloudmqtt.com', {username: 'xvwpkpzb', password: 'NXGd_6_hESIy', port: 15833});
client.on('connect', function () {
    client.subscribe('consumption');
});
  
client.on('message', function (topic, message) {
    const jsonMessage = message.toString('utf8');
    if (topic === 'consumption') {
        const waterConsumption = jsonMessage.water;
        const electricityConsumption = jsonMessage.electricity;
        const pedestal_id = jsonMessage.pedestal_id;
    }
});

module.exports = client;