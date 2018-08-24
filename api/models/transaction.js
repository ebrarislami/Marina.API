const transaction = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT,
        }
    });

    Transaction.associate = models => {
        Transaction.belongsTo(models.User, {
            foreignKey: 'operatorId'
        });
        Transaction.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Transaction.belongsTo(models.Docking, {
            foreignKey: 'dockingId'
        });
        Transaction.belongsTo(models.Reservation, {
            foreignKey: 'reservationId'
        });
    };

    return Transaction;
};

module.exports = transaction;