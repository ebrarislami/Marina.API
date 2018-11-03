'use strict';
module.exports = (sequelize, DataTypes) => {
  const logs_error = sequelize.define('logs_error', {
    date: DataTypes.DATE,
    berthId: DataTypes.STRING
  }, {});
  logs_error.associate = models => {
    logs_error.belongsTo(models.Berth);
  };
  return logs_error;
};