const reservation = (sequelize, DataTypes) => {
    const Reservation = sequelize.define('reservations', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
        },
    });
  
    
    Reservation.associate = models => {
        Reservation.belongsTo(models.Berth, {
            foreignKey: 'berthId'
        });
        Reservation.belongsTo(models.User, {
            foreignKey: 'userId'
        });
        Reservation.belongsTo(models.Yacht, {
            foreignKey: 'yachtId'
        });
        Reservation.hasOne(models.Docking);
    };
  
    return Reservation;
  };
  
  module.exports = reservation;