var mqtt = require('mqtt')
const models = require('./api/models');
const sequelize = require('./db');
// var pg = require('pg');

// var conString = "postgres://cmiatonx:pqPX9v4FEysA5T-PwJjJGi3Bdc2oxto4@horton.elephantsql.com/cmiatonx";

// var db = new pg.Client(conString);
// db.connect();

var client  = mqtt.connect('mqtt://m20.cloudmqtt.com', {username: 'xvwpkpzb', password: 'NXGd_6_hESIy', port: 15833});
client.on('connect', function () {
    client.subscribe('consumption');
});
  
client.on('message', async(topic, message) => {
    const jsonMessage = JSON.parse(message.toString('utf8'));
    if (topic === 'consumption') {
        const waterConsumption = jsonMessage.water;
        const electricityConsumption = jsonMessage.electricity;
        const berthId = jsonMessage.pedestal_id;
        if (waterConsumption !== 0 || electricityConsumption !== 0) {
            models.BerthConsumption.create({
                berthId: pedestal_id,
                water: waterConsumption,
                electricity: electricityConsumption
            }).then(result => {

            }).catch(err => {

            });

            // const berth = await models.Berth.findOne({where: {id: berthId}});
            // berth.electricity = elec;
            // berth.save().then(() => {
            // }).catch(err => console.log(err));
        }
    }
});


module.exports = client;