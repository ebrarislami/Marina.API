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
  
    // Marina.associate = models => {
    //     Marina.belongsTo(models.User, {
    //         foreignKey: 'userId'
    //     });
    // };
  
    return Marina;
  };
  
  module.exports = marina;