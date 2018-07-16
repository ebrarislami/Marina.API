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
        // models.Berth.find({where: {id: pedestal_id}}).then(result => {
            
        // });
        models.Berth.update({water: 1, electricity: 1}, { where: {id: pedestal_id}}).then(result => {
            
        }).catch(err => {
            // return error(res, err.message);
        });
    }
});

module.exports = client;