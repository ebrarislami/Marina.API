const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const redis = require('../../redis');

exports.waterOn = async(req, res, next) => {
    io.sockets.emit('water',{state: 'wOn'});
    res.status(200).json();
};
 
exports.waterOff = async(req, res, next) => {
    io.sockets.emit('water', {state: 'wOff'});
    res.status(200).json();
};

exports.electricityOn = async(req, res, next) => {
    let socketsObject = io.sockets.sockets;
    let sockets = [];
    for (const property in socketsObject) {
        const socket = socketsObject[property];
        sockets.push(socket.id);
    }
    // io.sockets.to(sockets[0]).emit('electricity',{state: 'eOn'});
    io.sockets.emit('electricity',{state: 'eOn'});
    res.status(200).json();
};

exports.electricityOff = async(req, res, next) => {
    io.sockets.emit('electricity', {state: 'eOff'});
    res.status(200).json();
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
        return error(res, err.message);
    })
};