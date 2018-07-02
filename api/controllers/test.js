const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var redis = require('../../redis');


exports.getTest = async(req, res, next) => {
    const { Test } = models;
    const tests = await Test.findAll({});
    res.status(200).json(tests);
};


exports.postTest = async(req, res, next) => {
    const { Test } = models;
    const { water, electricity } = req.body;
    Test.create({
        electricity: electricity,
        water: water
    }).then(result => {
        const test = {
            id: result.id,
            water: result.water,
            electricity: result.electricity
        };
        res.status(200).json(test);
    }).catch(err => {
        return error(res, e.message);
    })
};