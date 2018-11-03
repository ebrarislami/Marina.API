'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'reservations',
      'isConfirmed',
     Sequelize.BOOLEAN
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'reservations',
      'isConfirmed'
    );
  }
};
