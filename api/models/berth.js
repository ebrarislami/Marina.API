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
    });
  
    
    Berth.associate = models => {
        Berth.belongsTo(models.Pedestal, {
            foreignKey: 'pedestalId'
        });
    };
  
    return Berth;
  };
  
  module.exports = berth;