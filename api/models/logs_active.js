'use strict';
module.exports = (sequelize, DataTypes) => {
  const logs_active = sequelize.define('logs_active', {
    date: DataTypes.DATE,
    berthId: DataTypes.STRING
  }, {});
  logs_active.associate = models => {
    logs_active.belongsTo(models.Berth);
  };
  return logs_active;
};