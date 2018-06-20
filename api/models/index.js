const Sequelize = require('sequelize');
const sequelize = require('../../db');

const models = {
    User: sequelize.import('./user'),
    Yacht: sequelize.import('./yacht'),
    Marina: sequelize.import('./marina'),
    MarinaRoles: sequelize.import('./marina_roles'),
    Pedestal: sequelize.import('./pedestal'),
    Berth: sequelize.import('./berth')
}


Object.keys(models).forEach(modelName => {
    if('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;