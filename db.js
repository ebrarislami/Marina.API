const Sequelize = require('sequelize');

sequelize = new Sequelize('d5qf1o2r6787oh', 'qwitotgjyertcb', 'b5547cebd6201dd1f65f29737b0ca309eb0637c38b96b8e5060fc5af0f1c6819', {
        host: 'ec2-107-20-237-78.compute-1.amazonaws.com',
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