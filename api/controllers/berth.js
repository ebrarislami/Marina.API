const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var redis = require('../../redis');
const Connection = require('../models/connections');
const client = require('../../mqtt');

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

exports.getMarinaBerths = async(req, res, next) => {
    const { marinaId } = req.params;
    const { Pedestal, Berth, Marina } = models;

    sequelize.query(`
    select b.*, m.id as marinaId
    from 
    berths b,
    pedestals p,
    marinas m
    where
        b."pedestalId" = p.id and
        p."marinaId" = m.id and
        m.id = ?;
    `, { replacements: [marinaId], type: sequelize.QueryTypes.SELECT })
    .then(result => {
        res.status(200).json(result);
    }).catch(err => {
        return error(res, err.message);
    });
};

exports.getBerth = async(req, res, next) => {
    const { berthId } = req.params;
    const { Berth } = models;
    try {
        const berth = await Berth.findOne({where: {id: berthId}});
        res.status(200).json(berth);
    }
    catch(err) {
        return error(res, err.message);
    }
};

exports.toggleBerthElectricity = async(req, res, next) => {
    const { berthId } = req.params;
    const { Berth } = models;
    try {
        const berth = await Berth.find({where: {id: berthId}});
        if (!berth) {
            
        } else {
            const isElectricityEnabled = !berth.isElectricityEnabled;
            berth.update({isElectricityEnabled: isElectricityEnabled}, { where: {id: berthId}}).then(result => {
                const obj = {
                    electricity: isElectricityEnabled ? 'On' : 'Off',
                };
                const buf = Buffer.from(JSON.stringify(obj));
                client.publish(berth.id, buf)
                res.status(200).json(berth);
            }).catch(err => {
                return error(res, err.message);
            });
        }
    }
    catch(err) {
        return error(res, err.message);
    }
}

exports.toggleBerthWater = async(req, res, next) => {
    const { berthId } = req.params;
    const { Berth } = models;
    try {
        const berth = await Berth.find({where: {id: berthId}});
        if (!berth) {
            res.status(404).json();
        } else {
            const isWaterEnabled = !berth.isWaterEnabled;
            berth.update({isWaterEnabled: isWaterEnabled}, { where: {id: berthId}}).then(result => {  
                const obj = {
                    water: isWaterEnabled ? 'On' : 'Off',
                };
                const buf = Buffer.from(JSON.stringify(obj));
                client.publish(berth.id, buf)
                res.status(200).json(berth);
            }).catch(err => {
                return error(res, err.message);
            });
        }
    }
    catch(err) {
        return error(res, err.message);
    }
}