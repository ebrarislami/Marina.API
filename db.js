const Sequelize = require('sequelize');

sequelize = new Sequelize('cmiatonx', 'cmiatonx', 'pqPX9v4FEysA5T-PwJjJGi3Bdc2oxto4', {
        host: 'horton.elephantsql.com',
        dialect: 'postgres',
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },

        operatorsAliases: false
    })

module.exports = sequelize;