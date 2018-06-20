const pedestal = (sequelize, DataTypes) => {
    const Pedestal = sequelize.define('pedestal', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        type: {
            type: DataTypes.ENUM,
            values: ['Type A', 'Type B', 'Type C'], 
            defaultValue: 'Type A', 
            allowNull: false
        }
    });
    
    Pedestal.associate = models => {
        Pedestal.hasMany(models.Berth);
        Pedestal.belongsTo(models.Marina, {
            foreignKey: 'marinaId'
        });
    };
  
    return Pedestal;
  };
  
  module.exports = pedestal;