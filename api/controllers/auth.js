const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');
const mailSender = require('../helpers/email-sender');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var redis = require('../../redis');


exports.signup = async(req, res, next) => {
    const { User } = models;
    const { email, password } = req.body;
    if (!email || !password) {
        return error(res, 'Email and Password are required.');
    }

    try {
        const user = await User.findOne({where: {email: email}});

        if (user) {
            return error(res, 'Email Exists.');
        }

        else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return error(res, err.message);
                }
                
                else { 
                    User.create({
                        email: email,
                        password: hash
                    }).then( createdUser => {
                        const token = jwt.sign({
                            email: createdUser.email,
                            userId: createdUser.id,
                            role: "User",
                        }, 'secret',
                        {
                            expiresIn: "30d"
                        });
                        let user = {
                            token: token,
                            id: createdUser.id,
                            email: createdUser.email,
                            role: "User"
                        };
                        res.status(200).json(user);
                    }).catch(e => {
                        return error(res, e.message);
                    });
                }
            });
        }

    } catch(error) {
        return error(res, error);
    }
}


exports.login = async(req, res, next) => {
    const { User, MarinaRoles } = models;
    const { email, password } = req.body;
    if (!email || !password) {
        return error(res, 'Email and Password are required.');
    }

    try {
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            return error(res, 'Auth Failed', 401);
        }
        else {
            const marinaUser = await MarinaRoles.findOne({where: {userId: user.id}});
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return error(res, 'Auth Failed', 401);
                }
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id,
                        marinaId: marinaUser ? marinaUser.marinaId : null,
                        role: marinaUser ? marinaUser.role : "User",
                    }, 'secret',
                    {
                        expiresIn: "24h"
                    });
    
                    const decodedToken = jwt.decode(token);
    
                    return res.status(200).json({
                        token: token,
                        email: email,
                        id: user.id,
                        marinaId: marinaUser ? marinaUser.marinaId : null,
                        role: marinaUser ? marinaUser.role : "User",
                        expiresIn: decodedToken.exp
                    });
                }
                return error(res, 'Auth Failed', 401);
            });
        }
    } catch(err) {
        return error(res, 'Unknown Error');
    }
};

exports.forgotPassword = async(req, res, next) => {
    const { User } = models;
    const { email } = req.body;

    if (!email) {
        return error(res, 'Email is required.');
    }

    try {
        const user = await User.findOne({where: {email: email}});
        if (!user) {
            return error(res, 'No User Found With Given Email');
        } 
        
        else {
            crypto.randomBytes(20, (e, buf) => {
                const token = buf.toString('hex');
                if (e) {
                    return error(res, e.message);
                } else {
                    const html = `
                    <p>You are receiving this because you have requested the reset of the password for your account.</p>
                    <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                    <a href="http://${req.headers.host}/api/auth/resetpassword/${token}">Reset Password</a>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;
                    const mailOptions = mailSender.mailOptions(email, 'Marina - Reset Password', html);
                    const transporter = mailSender.transporter(email);

                    transporter.sendMail(mailOptions, (e, info) => {
                        if (e) {
                            return error(res, e.message);
                        } else {
                            const redisUser = {
                                userId: user.id,
                                email: user.email,
                                resetPasswordExpires: Date.now() + 3600000
                            }

                            const stringRedisUser = JSON.stringify(redisUser);

                            redis.hset(token, token, stringRedisUser, (err, result) => {
                                if (!err) {
                                    return res.status(200).json();
                                } else {
                                    return error(res, err.message);
                                }
                            });
                        }
                    });
                }
              });
        }
    } catch(e) {
        return error(res, e.message);
    }
};


exports.resetPassword = async(req, res, next) => {
    const { token } = req.params;
    const { User } = models;
    if (!token) {
        return error(res, 'Token Not Found.');
    }

    else {
        redis.hgetall(token, (err, obj) => {
            console.log(obj);
            if (err) {
                return error(res, err.message);
            } else {

                if (!obj) {
                    return error(res, 'Token Not Found.');
                }

                const user = JSON.parse(obj[token]);
                const dateNow = Date.now();
                const dateTokenExpire = user.resetPasswordExpires;
                const expireTime = 36000;
                
                if (dateNow > dateTokenExpire) {
                    return error(res, 'Token Expired.');
                }
    
                else {
                    crypto.randomBytes(4, (e, buf) => {

                        if(e) {
                            return error(res, e.message);
                        } else {
                            const newPassword = buf.toString('hex');

                            bcrypt.hash(newPassword, 10, (err, hash) => {
                                if (err) {
                                    return error(res, err.message);
                                } else {
                                    User.update({password: hash}, 
                                        { where: { email: user.email } }).
                                        then((result) => {
                                            if (result.length === 1) {
                                                const html = `
                                                <p>Your new password: ${newPassword}</p>`;
                                                const mailOptions = mailSender.mailOptions(user.email, 'Marina - New Password', html);
                                                const transporter = mailSender.transporter(user.email);

                                                transporter.sendMail(mailOptions, (e, info) => {
                                                    if (e) {
                                                        return error(res, e.message);
                                                    } else {
                                                        redis.del(token);
                                                        return res.status(200).json('Successfull');
                                                    }
                                                });
                                            } else {
                                                return error(res, 'Cant find user with given email');
                                            }
                                        }).catch(err => {
                                            return error(res, err.message);
                                    });
                                }
                            });
                        }
                    })
                    
                }     
            }
        });
    }
}