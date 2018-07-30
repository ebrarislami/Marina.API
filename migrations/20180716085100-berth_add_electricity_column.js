'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'berths',
      'electricity',
     Sequelize.FLOAT
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'berths',
      'electricity'
    );
  }
};
