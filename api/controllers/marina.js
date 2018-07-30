const models = require('../models');
const error = require('../helpers/error-handler');


exports.remove = async (req, res, next) => {
    const { Marina } = models;
    const { userData } = req;
    const { id } = req.params;

    Marina.destroy({
        
        where: {id: id}

    }).then(deleteMarina => {

        res.status(200).json(deleteMarina);
    }).catch(err => {
        return error(res, err.message);
});
};

exports.createMarinas = async (req, res, next) => {
    console.log(req.userData)
    const { Marina, MarinaRoles } = models;
    const { name, role } = req.body;

    Marina.create({
        name: name
    }).then(newMarina => {
        MarinaRoles.create({
            marinaId: newMarina.id,
            userId: req.userData.userId,
            role: role
        }).then(newRole => {
    
            res.status(200).json(newRole);
    
        })
        .catch(err => {
            return error(res, err.message);
    })
}).catch(err => {
        return error(res, err.message);
    });
};

exports.getMarinas = async(req, res, next) => {
    console.log(req.userData)
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
        const marinas = await Marina.find({include: [ Pedestal ]}, {where: {id: marinaId}});
        res.status(200).json(marinas);
    }
    catch(err) {
        return error(res, err.message);
    }
};