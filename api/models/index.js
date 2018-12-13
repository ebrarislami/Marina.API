const Sequelize = require('sequelize');
const sequelize = require('../../db');

const models = {
    User: sequelize.import('./user'),
    Yacht: sequelize.import('./yacht'),
    YachtOwners: sequelize.import('./yacht_owners'),
    Marina: sequelize.import('./marina'),
    MarinaRoles: sequelize.import('./marina_roles'),
    Pedestal: sequelize.import('./pedestal'),
    Berth: sequelize.import('./berth'),
    Reservation: sequelize.import('./reservation'),
    Docking: sequelize.import('./docking'),
    BerthConsumption: sequelize.import('./berth_consumption'),
    Transaction: sequelize.import('./transaction'),
    Test: sequelize.import('./test'),
    LogsActive: sequelize.import('./logs_active'),
    LogsError: sequelize.import('./logs_error'),
    LogsStatus: sequelize.import('./logs_status'),
    LogsStatusConflict: sequelize.import('./logs_status_conflict')
}


Object.keys(models).forEach(modelName => {
    if('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;