const logsStatusConflict = (sequelize, DataTypes) => {
    const LogsStatusConflict = sequelize.define('logs_status_conflict', {
        db_e_stat: {
            type: DataTypes.BOOLEAN
        },
        mq_e_stat: {
            type: DataTypes.BOOLEAN
        },
        db_w_stat: {
            type: DataTypes.BOOLEAN
        },
        mq_w_stat: {
            type: DataTypes.BOOLEAN
        },
    });
  
    LogsStatusConflict.associate = models => {
        LogsStatusConflict.belongsTo(models.Berth, {
        foreignKey: 'berthId'
      });
    };
  
    return LogsStatusConflict;
  };
  
  module.exports = logsStatusConflict;