'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'reservations',
      'fromDate',
     Sequelize.BOOLEAN
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reservations',
      'fromDate'
    );
  }
};
