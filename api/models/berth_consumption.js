const berth_consumption = (sequelize, DataTypes) => {
    const BerthConsumption = sequelize.define('berth_consumption', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        water: {
            type: DataTypes.FLOAT,
        },
        electricity: {
            type: DataTypes.FLOAT,
        }
    });
  
    
    BerthConsumption.associate = models => {
        BerthConsumption.belongsTo(models.Berth, {
            foreignKey: 'berthId'
        });
    };
  
    return BerthConsumption;
  };
  
  module.exports = berth_consumption;