'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'reservations', // name of Source model
      'yachtId', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        references: {
          model: 'yachts', // name of Target model
          key: 'id', // key in Target model that we're referencing
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'reservations', // name of Source model
      'yachtId' // key we want to remove
    );
  }
};