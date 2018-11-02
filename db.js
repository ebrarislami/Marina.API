const Sequelize = require('sequelize');

sequelize = new Sequelize('d8j2i75fts1o10', 'ctedjzxtbdxilu', 'd22e7e08d80d5d127cd6414588e9e4b16998e4c4ba8748908e751d81347f9360', {
        host: 'ec2-23-21-246-25.compute-1.amazonaws.com',
        dialect: 'postgres',
      
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },

        dialectOptions: {
          ssl: true
        },

        operatorsAliases: false
    })

module.exports = sequelize;