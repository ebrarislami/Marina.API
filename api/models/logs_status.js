const logsStatus = (sequelize, DataTypes) => {
    const LogsStatus = sequelize.define('logs_status', {
      electricityStatus: {
        type: DataTypes.BOOLEAN,
      },
      waterStatus: {
        type: DataTypes.BOOLEAN,
      },
    });
  
    LogsStatus.associate = models => {
        LogsStatus.belongsTo(models.Berth, {
        foreignKey: 'berthId'
      });
    };
  
    return LogsStatus;
  };
  
  module.exports = logsStatus;