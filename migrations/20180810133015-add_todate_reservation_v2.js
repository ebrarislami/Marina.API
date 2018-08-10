'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'reservations',
      'toDate',
     Sequelize.DATE
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reservations',
      'toDate'
    );
  }
};
