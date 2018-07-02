const models = require('../models');
const error = require('../helpers/error-handler');

exports.getMarinas = async(req, res, next) => {
    const { Marina, MarinaRoles, User } = models;
    try {
        const marinas = await Marina.findAll({include: [ User ]});
        res.status(200).json(marinas);
    }
    catch(err) {
        return error(res, err.message);
    }
};

exports.getMarina = async(req, res, next) => {
    const { marinaId } = req.params;
    const { Marina, MarinaRoles, User, Pedestal, Berth } = models;
    try {
        const marinas = await Marina.findAll({include: [ Pedestal ]}, {where: {id: marinaId}});
        res.status(200).json(marinas);
    }
    catch(err) {
        return error(res, err.message);
    }
};