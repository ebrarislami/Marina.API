const logsActive = (sequelize, DataTypes) => {
  const LogsActive = sequelize.define('logs_active', {
    data: {
      type: DataTypes.STRING,
    },
  });

  LogsActive.associate = models => {
    LogsActive.belongsTo(models.Berth, {
      foreignKey: 'berthId'
    });
  };

  return LogsActive;
};

module.exports = logsActive;