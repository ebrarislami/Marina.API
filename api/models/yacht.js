const yacht = (sequelize, DataTypes) => {
    const Yacht = sequelize.define('yacht', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
    });

    Yacht.associate = models => {
        Yacht.hasMany(models.Reservation);
        Yacht.belongsToMany(models.User, { through: models.YachtOwners });
    };

    return Yacht;
};

module.exports = yacht;