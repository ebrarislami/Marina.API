const docking = (sequelize, DataTypes) => {
    const Docking = sequelize.define('dockings', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
    });
  
    
    Docking.associate = models => {
        Docking.belongsTo(models.Reservation);
        Docking.hasMany(models.Transaction);
    };
  
    return Docking;
  };
  
  module.exports = docking;