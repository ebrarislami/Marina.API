const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const error = require('../helpers/error-handler');

exports.createReservation = async(req, res, next) => {
    const { berthId, fromDate, toDate } = req.body;
    const { userId } = req.userData;
    const { marinaId } = req.params;
    const { Reservation } = models;
    const isConfirmed = null;
    const isStarted = false;

    if (fromDate > toDate) {
        return error(res, 'Invalid Date'); 
    }

    if (!marinaId || !berthId) {
        return error(res, 'Invalid Request'); 
    }


    sequelize.query(`
        select b.*
        from berths b,
        pedestals p,
        marinas m
        where
            b."pedestalId" = p.id and
            p."marinaId" = m.id and
            m.id = ? and b."isAvailable" 
        limit 1;
    `, { replacements: [marinaId], type: sequelize.QueryTypes.SELECT })
    .then(result => {
        if (result.length > 0) {
            const berth = result[0];
            Reservation.create({
                berthId: berth.id,
                marinaId,
                userId,
                isConfirmed,
                fromDate,
                toDate,
                isStarted
            }).then(reservation => {
                res.status(200).json(reservation);
            }).catch(err => {
                return error(res, err.message);
            });
        } else {
            return error(res, 'No Free Pedestal');
        }
    }).catch(err => {
        return error(res, err.message);
    });
};
 
exports.getReservation = async(req, res, next) => {
    const { Reservation, BerthConsumption, Berth } = models;
    const { reservationId } = req.params;

    sequelize.query(`
        select r.*, p.id as pedestalId, m.id as marinaid, p.name as pedestalName, b.name as berthName
        from 
        reservations r,
        berths b,
        pedestals p,
        marinas m
        where
            r."berthId" = b.id and
            b."pedestalId" = p.id and
            p."marinaId" = m.id and
            r.id = ?
        limit 1;
        `, { replacements: [reservationId], type: sequelize.QueryTypes.SELECT })
            .then(result => {
                if (result.length) {
                    res.status(200).json(result[0]);
                } else {
                    res.status(404).json();
                }
            }).catch(err => {
                return error(res, err.message);
            });
};

exports.getMarinaReservations = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { marinaId } = req.params;
    sequelize.query(`
        select r.*, p.id as pedestalId, m.id as marinaid, p.name as pedestalName, b.name as berthName
        from reservations r,
        berths b,
        pedestals p,
        marinas m
        where
            r."berthId" = b.id and
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

exports.getUserReservations = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { userId } = req.params;
    try {
        const reservations = await Reservation.findAll({where: {userId: userId}});
        res.status(200).json(reservations);
    } catch(err) {
        return error(res, err.message);
    }
};


exports.getBerthReservations = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { berthId } = req.params;
    try {
        const reservations = await Reservation.findAll({where: {berthId: berthId}});
        res.status(200).json(reservations);
    } catch(err) {
        return error(res, err.message);
    }
};

exports.acceptReservation = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { reservationId } = req.params;
    try {
        const reservation = await Reservation.findOne({where: {id: reservationId}});
        reservation.isConfirmed = true;
        reservation.save().then(() => {
            res.status(200).json(reservation);
        }).catch(err => error(res, err.message));
    } catch(err) {
        return error(res, err.message);
    }
};

exports.declineReservation = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { reservationId } = req.params;
    try {
        const reservation = await Reservation.findOne({where: {id: reservationId}});
        reservation.isConfirmed = false;
        reservation.save().then(() => {
            res.status(200).json(reservation);
        }).catch(err => error(res, err.message));
    } catch(err) {
        return error(res, err.message);
    }
};

exports.startReservation = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation, Docking, Transaction} = models;
    const { reservationId } = req.params;
    const { amount } = req.body;
    const { userId } = req.userData;

    if (!amount) {
        return error(res, "Amount should be greater than 0");
    }

    try {
        const reservation = await Reservation.findOne({where: {id: reservationId}});
        reservation.isStarted = true;
        reservation.save().then(() => {

            Docking.create({
                reservationId: reservationId
            }).then(docking => {
                Transaction.create({
                    dockingId: docking.id,
                    reservationId: reservationId,
                    amount: amount,
                    userId: userId
                }).then(transaction => {
                    res.status(200).json(docking);
                }).catch(err => {
                    return error(res, err.message);
                });
            }).catch(err => {
                return error(res, err.message);
            });
        }).catch(err => error(res, err.message));
    } catch(err) {
        return error(res, err.message);
    }
};

exports.addAmountReservation = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation, Docking, Transaction} = models;
    const { reservationId } = req.params;
    const { amount } = req.body;
    const { userId } = req.userData;

    if (!amount) {
        return error(res, "Amount should be greater than 0");
    }

    try {
        const docking = await Docking.findOne({where: {reservationId: reservationId}});

        if (docking) {
            Transaction.create({
                dockingId: docking.id,
                reservationId: reservationId,
                amount: amount,
                userId: userId
            }).then(transaction => {
                res.status(200).json(transaction);
            }).catch(err => {
                return error(res, err.message);
            });
        } else {
            return error(res, "Docking not found!");
        }
    } catch(err) {
        return error(res, err.message);
    }
};