'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'berths', // name of Source model
      'isElectricityEnabled', // name of the key we're adding 
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'berths', // name of Source model
      'isElectricityEnabled' // key we want to remove
    );
  }
};
