const berth = (sequelize, DataTypes) => {
    const Berth = sequelize.define('berth', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isElectricityEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isWaterEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
  
    
    Berth.associate = models => {
        Berth.hasMany(models.Reservation);
        Berth.belongsTo(models.Pedestal, {
            foreignKey: 'pedestalId'
        });
    };
  
    return Berth;
  };
  
  module.exports = berth;