const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var redis = require('../../redis');

exports.createMarinaPedestal = async(req, res, next) => {
    const { marinaId } = req.params;
    const { Pedestal, Berth } = models;
    const { type, name } = req.body;
    
    Pedestal.create({
        name: name,
        type: type,
        marinaId: marinaId
    }).then(result => {
        createBerth(result).then(berthResult => {
            // const pedestals = await Pedestal.findAll({where: {marinaId: marinaId}, include: [Berth]});
            res.status(200).json(result);
        }).catch(err => {
            return error(res, err.message);
        });
        // res.status(200).json(result);
    }).catch(err => {
        return error(res, err.message);
    });
};

createBerth = (result) => {
    const { Pedestal, Berth } = models;
    if (result.type === 'Type C') {
            return Berth.bulkCreate([
                {name: 'Berth 1', pedestalId: result.id},
                {name: 'Berth 2', pedestalId: result.id},
            ])
    } else {
        return Berth.bulkCreate([
            {name: 'Berth 1', pedestalId: result.id},
            {name: 'Berth 2', pedestalId: result.id},
            {name: 'Berth 3', pedestalId: result.id},
            {name: 'Berth 4', pedestalId: result.id}
        ])
    }
};

exports.getAllMarinaPedestals = async(req, res, next) => {
    const { marinaId } = req.params;
    const { Pedestal, Berth } = models;
    try {
        const pedestals = await Pedestal.findAll({where: {marinaId: marinaId}, include: [{model: Berth, order: [['id', 'DESC']]}]   
            ,order: [['createdAt', 'DESC']]});
        res.status(200).json(pedestals);
    }
    catch(err) {
        return error(res, err.message);
    }
};

exports.getPedestalBerths = async(req, res, next) => {
    const { pedestalId } = req.params;
    const { Pedestal, Berth } = models;
    try {
        const berths = await Berth.findAll({where: {pedestalId: pedestalId}});
        res.status(200).json(berths);
    }
    catch(err) {
        return error(res, err.message);
    }
};