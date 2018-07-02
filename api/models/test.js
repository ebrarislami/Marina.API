const test = (sequelize, DataTypes) => {
    const Test = sequelize.define('test', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        water: {
            type: DataTypes.FLOAT,
        },
        electricity: {
            type: DataTypes.FLOAT,
        }
    });

    return Test;
};

module.exports = test;