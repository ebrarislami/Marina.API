const marina = (sequelize, DataTypes) => {
    const Marina = sequelize.define('marina', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
    });
  
    
    Marina.associate = models => {
        Marina.hasMany(models.Pedestal);
        Marina.belongsToMany(models.User, { through: models.MarinaRoles });
    };
  
    return Marina;
  };
  
  module.exports = marina;