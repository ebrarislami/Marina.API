'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'reservations',
      'fromDate',
     Sequelize.DATE
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reservations',
      'fromDate'
    );
  }
};
