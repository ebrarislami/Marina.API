const service = (sequelize, DataTypes) => {
    const Service = sequelize.define('service', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
    });
  
    
    Service.associate = models => {
        Marina.hasMany(models.Pedestal);
        Marina.belongsToMany(models.User, { through: models.MarinaRoles });
    };
  
    return Service;
  };
  
  module.exports = service;