const models = require("../models");
const error = require("../helpers/error-handler");
const moment = require("moment");
const { Op } = require("sequelize");
const sequelize = require("../../db");

exports.getStats = async (req, res, next) => {
  const { BerthConsumption, Docking, Berth } = models;
  try {
    const waterConsumption = await BerthConsumption.sum("water", {
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("month")
        }
        //isClosed: false
      }
    });

    const electricityConsumption = await BerthConsumption.sum("electricity", {
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("month")
        }
        //isClosed: false
      }
    });

    const todayWaterConsumption = await BerthConsumption.sum("water", {
      where: {
        createdAt: {
          [Op.gte]: moment().startOf("day")
        }
        //isClosed: false
      }
    });

    const todayElectricityConsumption = await BerthConsumption.sum(
      "electricity",
      {
        where: {
          createdAt: {
            [Op.gte]: moment().startOf("day")
          }
          //isClosed: false
        }
      }
    );

    const activeDockings = await Docking.findAndCountAll({
      where: {
        isClosed: true
      }
    });

    const inActiveDockings = await Docking.findAndCountAll({
      where: {
        isClosed: false
      }
    });

    const activeWater = await Berth.findAndCountAll({
      where: {
        isWaterEnabled: true
      }
    });

    const inActiveWater = await Berth.findAndCountAll({
      where: {
        isWaterEnabled: false
      }
    });

    const activeElectricity = await Berth.findAndCountAll({
      where: {
        isElectricityEnabled: true
      }
    });

    const inActiveElectricity = await Berth.findAndCountAll({
      where: {
        isElectricityEnabled: false
      }
    });

    const allBerths = await Berth.findAndCountAll({});

    const activeBerths = await Berth.findAndCountAll({
      where: {
        isAvailable: false
      }
    });

    const data = {
      thisMonthWater: waterConsumption * (1 / 310),
      thisMonthElectricity: electricityConsumption / 1000,
      todayWater: todayWaterConsumption * (1 / 310),
      todayElectricity: todayElectricityConsumption / 1000,
      totalDockings: activeDockings.count + inActiveDockings.count,
      activeDockings: activeDockings.count,
      inActiveDockings: inActiveDockings.count,
      totalWater: activeWater.count + inActiveWater.count,
      activeWater: activeWater.count,
      inActiveWater: inActiveWater.count,
      totalElectricity: activeElectricity.count + inActiveElectricity.count,
      activeElectricity: activeElectricity.count,
      inActiveElectricity: inActiveElectricity.count,
      activeBerths: activeBerths.count,
      allBerths: allBerths.count
    };
    res.status(200).json(data);
  } catch (err) {
    return error(res, err.message);
  }
};

exports.getHourConsumption = async (req, res, next) => {
  const query = `SELECT  sum(water) s_water, sum(electricity) s_electricity, "berthId", date_trunc('hour', "createdAt") dates 
    FROM public.berth_consumptions 
    group by "berthId", date_trunc('hour', "createdAt")`;

  sequelize
    .query(query)
    .then(result => {
      if (result.length > 0) {
        res.status(200).json(result);
      }
    })
    .catch(err => console.log(err));
};

exports.getBerthHourConsumption = async (req, res, next) => {
  const { berthID } = req.params;
  const query = `SELECT  sum(water) s_water, sum(electricity) s_electricity, "berthId", date_trunc('hour', "createdAt") dates 
  FROM public.berth_consumptions 
  where "berthId" = ? 
  group by "berthId", date_trunc('hour', "createdAt") 
  order by date_trunc('hour', "createdAt");`;

  sequelize
    .query(query, {
      replacements: [berthID],
      type: sequelize.QueryTypes.SELECT
    })
    .then(result => {
      if (result.length > 0) {
        res.status(200).json(result);
      }
    })
    .catch(err => console.log(err));
};
