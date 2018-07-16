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

exports.getBerth = async(req, res, next) => {
    const { berthId } = req.params;
    const { Berth } = models;
    try {
        const berth = await Berth.find({where: {id: berthId}});
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
            berth.isElectricityEnabled = isElectricityEnabled;
            client.publish(berth.id, isElectricityEnabled ? 'eOn' : 'eOff')
            Berth.update({isElectricityEnabled: isElectricityEnabled}, { where: {id: berthId}}).then(result => {
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
            client.publish(berth.id, isWaterEnabled ? 'wOn' : 'wOff')
            berth.isWaterEnabled = isWaterEnabled;
            Berth.update({isWaterEnabled: isWaterEnabled}, { where: {id: berthId}}).then(result => {
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