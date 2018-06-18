const user = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'USER'
        },
        phone: {
            type: DataTypes.STRING,
        },
        fullName: {
            type: DataTypes.STRING,
        }
    });
  
    User.associate = models => {
      User.hasMany(models.Yacht);
    };
  
    return User;
  };
  
  module.exports = user;