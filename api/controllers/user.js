const models = require('../models');
const error = require('../helpers/error-handler');


exports.getUsers = async(req, res, next) => {
    const { User, Yacht } = models;
    try {
        const users = await User.findAll({include: [Yacht]});
        res.status(200).json(users);
    } catch(err) {
        return error(res, err.message);
    }
};


exports.createUserYacht = async(req, res, next) => {
    const { User, Yacht } = models;
    try {
        const users = await User.findAll({include: [Yacht]});
        res.status(200).json(users);
    } catch(err) {
        return error(res, err.message);
    }
};