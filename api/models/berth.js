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
        },
        water: {
            type: DataTypes.FLOAT,
        },
        electricity: {
            type: DataTypes.FLOAT,
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