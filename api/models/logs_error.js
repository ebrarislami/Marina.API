const logsError = (sequelize, DataTypes) => {
  const LogsError = sequelize.define('logs_error', {
    data: {
      type: DataTypes.STRING,
    },
  });

  LogsError.associate = models => {
    LogsError.belongsTo(models.Berth, {
      foreignKey: 'berthId'
    });
  };

  return LogsError;
};

module.exports = logsError;