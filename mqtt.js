var mqtt = require("mqtt");
const models = require("./api/models");
const sequelize = require("./db");
var cron = require("node-cron");
// var pg = require('pg');

// var conString = "postgres://cmiatonx:pqPX9v4FEysA5T-PwJjJGi3Bdc2oxto4@horton.elephantsql.com/cmiatonx";

// var db = new pg.Client(conString);
// db.connect();

var client = mqtt.connect(
  "mqtt://m20.cloudmqtt.com",
  { username: "xvwpkpzb", password: "NXGd_6_hESIy", port: 15833 }
);
client.on("connect", function() {
  client.subscribe("consumption");
  client.subscribe("getInfos");
  client.subscribe("6088f220-7f7c-11e8-bf94-39e4e1b78ae0");
  client.subscribe("60891930-7f7c-11e8-bf94-39e4e1b78ae0");
  client.subscribe("6088f221-7f7c-11e8-bf94-39e4e1b78ae0");
  client.subscribe("60891931-7f7c-11e8-bf94-39e4e1b78ae0");

  // client.publish('6088f220-7f7c-11e8-bf94-39e4e1b78ae0', 'reset');
  client.publish("getInfos", "infoMQTT");
  console.log("Connected to MQTT...");
});

client.on("message", async (topic, message) => {
  if (topic === "consumption") {
    const jsonMessage = JSON.parse(message.toString("utf8"));
    //console.log('JSON MESSAGE:', jsonMessage);
    const waterConsumption = jsonMessage.water;
    const electricityConsumption = jsonMessage.electricity;
    const berthId = jsonMessage.pedestal_id;
    const isWaterEnabled = jsonMessage.waterStatus;
    const isElectricityEnabled = jsonMessage.electricityStatus;
    //console.log('****************************************************berthid:', berthId);
    const query = `
        select d.*, b.id as "berthId"
        from
            dockings d,
            reservations r,
            berths b
        where
            d."reservationId" = r.id and
            r."berthId" = b.id and
            b.id = ? and d."isClosed" = false;
        `;

    sequelize
      .query(query, {
        replacements: [berthId],
        type: sequelize.QueryTypes.SELECT,
        model: models.Docking
      })
      .then(result => {
        if (result.length > 0) {
          const docking = result[0];
          //console.log("Dockiiing ", docking);
          if (docking) {
            docking.waterConsumption += waterConsumption;
            docking.electricityConsumption += electricityConsumption;
            docking
              .save()
              //.then(() => {

              //  console.log('--------------------docking:', docking);
              //  console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&docking is:', docking.dataValues.berthId);

              // const berthId = docking.berthId;
              // if (typeof berthId != "undefined" && berthId) {
              //   //console.log(" 1 ------ Docking ID: ", berthId);
              //   models.Berth.findOne({ where: { id: berthId } })
              //     .then(berth => {
              //       // console.log(" 2 ----- *****Berdh ID   ", berth);
              //       berth.isWaterEnabled = isWaterEnabled;
              //       berth.isElectricityEnabled = isElectricityEnabled;
              //       berth
              //         .save()
              //         .then(() => {})
              //         .catch(err => console.log(err));
              //     })
              //     .catch(err => console.log(err));
              // }
              //})
              .catch(err => console.log(err));
          }
        }
      })
      .catch(err => console.log(err));

    // const docking = await models.Docking.findOne({include: [ models.Reservation ]}, {where: {berthId: berthId, isClosed: false}});
    // console.log(docking)
    // if (docking && (docking.waterConsumption !== waterConsumption || docking.electricityConsumption !== electricityConsumption)) {
    //     docking.waterConsumption = waterConsumption;
    //     docking.electricityConsumption = electricityConsumption;
    //     docking.save().then(() => {}).catch(err => console.log(err));
    // }

    // models.BerthConsumption.create({
    //     berthId: berthId,
    //     water: waterConsumption,
    //     electricity: electricityConsumption
    // }).then(result => {

    // }).catch(err => {

    // });

    // const berth = await models.Berth.findOne({where: {id: berthId}});
    // berth.electricity = elec;
    // berth.save().then(() => {
    // }).catch(err => console.log(err));

    LogsActive = models.LogsActive;

    LogsActive.create({
      berthId: berthId,
      data:
        "isWaterEnabled: " +
        isWaterEnabled +
        " | " +
        "isElectricityEnabled: " +
        isElectricityEnabled +
        " | " +
        "waterConsumption: " +
        waterConsumption +
        " | " +
        "electricityConsumption: " +
        electricityConsumption
    });

    if (electricityConsumption > 0 || waterConsumption > 0) {
      BerthConsumption = models.BerthConsumption;

      BerthConsumption.create({
        berthId: berthId,
        water: waterConsumption,
        electricity: electricityConsumption
      });
    }

    models.Berth.findOne({ where: { id: berthId } })
      .then(berth => {
        if (
          berth.dataValues.isWaterEnabled != isWaterEnabled ||
          berth.dataValues.isElectricityEnabled != isElectricityEnabled
        ) {
          console.log("inside 1 ****************************************");
          LogsStatusConflict = models.LogsStatusConflict;

          LogsStatusConflict.create({
            berthId: berthId,
            db_e_stat: berth.dataValues.isElectricityEnabled,
            mq_e_stat: isElectricityEnabled,
            db_w_stat: berth.dataValues.isWaterEnabled,
            mq_w_stat: isWaterEnabled
          });

          if (
            berth.dataValues.isWaterEnabled != isWaterEnabled &&
            berth.dataValues.isWaterEnabled == true
          ) {
            console.log("inside 2 ****************************************");
            client.publish(berthId, '{"water":"On"}');
          }

          if (
            berth.dataValues.isWaterEnabled != isWaterEnabled &&
            berth.dataValues.isWaterEnabled == false
          ) {
            console.log("inside 3 ****************************************");
            client.publish(berthId, '{"water":"Off"}');
          }

          if (
            berth.dataValues.isElectricityEnabled != isElectricityEnabled &&
            berth.dataValues.isElectricityEnabled == true
          ) {
            console.log("inside 4 ****************************************");
            client.publish(berthId, '{"electricity":"On"}');
          }

          if (
            berth.dataValues.isElectricityEnabled != isElectricityEnabled &&
            berth.dataValues.isElectricityEnabled == false
          ) {
            console.log("inside 5 ****************************************");
            client.publish(berthId, '{"electricity":"Off"}');
          }
        }
      })
      .catch(err => console.log(err));
  } else if (topic === "getInfos") {
    console.log("Get info topiic");
  } else {
    console.log("Got in!!!! ");

    LogsStatus = models.LogsStatus;
    const jsonMessage = JSON.parse(message.toString("utf8"));

    waterState = jsonMessage.water || null;
    electricityState = jsonMessage.electricity || null;

    eStatus = false;
    wStatus = false;
    if (electricityState === "On") {
      eStatus = true;
    }

    if (waterState === "On") {
      wStatus = true;
    }

    if (electricityState) {
      LogsStatus.create({
        berthId: topic,
        electricityStatus: eStatus
      });
    } else {
      LogsStatus.create({
        berthId: topic,
        waterStatus: wStatus
      });
    }
  }
});

//insert into logs every 20 sec
cron.schedule("*/10 * * * * *", function() {
  // client.publish("60891930-7f7c-11e8-bf94-39e4e1b78ae0", "{\"water\":\"Off\"}");

  client.publish("getInfos", "running a task every 20 seconds");
  console.log("running a task every 20 seconds");
});

//insert into logs every 1 min
cron.schedule("1 * * * * *", function() {
        models.LogsActive.count().then(result => {
          if (result.length > 0) {
            models.LogsActive.destroy({
              where: {},
              truncate: true
            });
          } else {
            LogsError = models.LogsError;
            LogsError.create({
              berthId: "60891930-7f7c-11e8-bf94-39e4e1b78ae0",
              data: "Error not working"
            });
          }
        });
});
module.exports = client;
