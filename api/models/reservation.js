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
        fromDate: {
            type: DataTypes.DATE
        },
        toDate: {
            type: DataTypes.DATE
        },
        isStarted: {
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
        Reservation.belongsTo(models.Marina, {
            foreignKey: 'marinaId'
        });
        Reservation.hasOne(models.Docking);
        Reservation.hasMany(models.Transaction);
    };
  
    return Reservation;
  };
  
  module.exports = reservation;