const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var redis = require('../../redis');


exports.getAllMarinaPedestals = async(req, res, next) => {
    console.log(req.userData)
    const { User, Marina, MarinaRoles, Pedestal } = models;
    const marines = await Marina.findAll({where: {id: req.userData.marinaId}, include: [Pedestal]});
    // const marines = await Pedestal.findAll({where: {marinaId: req.userData.marinaId}, include: [Marina]});
    res.status(200).json(marines);
};