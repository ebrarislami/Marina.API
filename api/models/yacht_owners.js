const yachtOwners = (sequelize, DataTypes) => {
    const YachtOwners = sequelize.define('yacht_owners', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
    });
    return YachtOwners;
  };
  
  module.exports = yachtOwners;