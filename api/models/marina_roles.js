const marinaRoles = (sequelize, DataTypes) => {
    const MarinaRoles = sequelize.define('marina_roles', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: DataTypes.ENUM,
            values: ['Admin', 'Staff'],
            defaultValue: 'Staff',
            allowNull: false
        }
    });

    // Marina.associate = models => {
    //     Marina.belongsTo(models.User, {
    //         foreignKey: 'userId'
    //     });
    // };

    return MarinaRoles;
};

module.exports = marinaRoles;