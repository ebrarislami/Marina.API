var mqtt = require('mqtt')
const models = require('./api/models');


var client  = mqtt.connect('mqtt://m20.cloudmqtt.com', {username: 'xvwpkpzb', password: 'NXGd_6_hESIy', port: 15833});
client.on('connect', function () {
    client.subscribe('consumption');
});
  
client.on('message', function (topic, message) {
    const jsonMessage = JSON.parse(message.toString('utf8'));
    if (topic === 'consumption') {
        const waterConsumption = jsonMessage.water;
        const electricityConsumption = jsonMessage.electricity;
        const pedestal_id = jsonMessage.pedestal_id;
        models.Berth.findOne({where: {id: pedestal_id}}).then(result => {
            const water = result.water + waterConsumption;
            const electricity = result.electricity + electricityConsumption;
            models.Berth.update({water: water, electricity: electricity}, { where: {id: pedestal_id}}).then(result => {
            
            }).catch(err => {
            });
        });
    }
});

module.exports = client;