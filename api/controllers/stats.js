const models = require("../models");
const error = require("../helpers/error-handler");
const moment = require("moment");
const { Op } = require("sequelize");

exports.getStats = async (req, res, next) => {
  const { Docking, Berth } = models;
  try {
    const waterConsumption = await Docking.sum("waterConsumption", {
      where: {
        updatedAt: {
          [Op.gte]: moment().startOf("month")
        },
        isClosed: false
      }
    });

    const electricityConsumption = await Docking.sum("electricityConsumption", {
      where: {
        updatedAt: {
          [Op.gte]: moment().startOf("month")
        },
        isClosed: false
      }
    });

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
      water: waterConsumption * (1 / 310),
      electricity: electricityConsumption / 1000,
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

exports.getCustomDay = async (req, res, next) => {
  const { day } = req.params;
  const { Marina, MarinaRoles, User, Pedestal, Docking, Berth } = models;
  try {
    const electricityConsumption = await Docking.sum("electricityConsumption", {
      where: {
        updatedAt: {
          [Op.lte]: moment()
            .subtract(day, "days")
            .toDate(),
          [Op.gte]: moment()
            .subtract(day - 1, "days")
            .toDate()
        }
      }
    });

    const waterConsumption = await Docking.sum("waterConsumption", {
      where: {
        updatedAt: {
          [Op.lte]: moment()
            .subtract(day, "days")
            .toDate(),
          [Op.gte]: moment()
            .subtract(day - 1, "days")
            .toDate()
        }
      }
    });
    const data = {
      electricityConsumption: electricityConsumption,
      waterConsumption: waterConsumption
    };
    res.status(200).json(data);
  } catch (err) {
    return error(res, err.message);
  }
};
