'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'berths',
      'water',
     Sequelize.FLOAT
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'berths',
      'water'
    );
  }
};
