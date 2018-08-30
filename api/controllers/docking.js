const models = require('../models');
const error = require('../helpers/error-handler');
const Sequelize = require('sequelize');
const client = require('../../mqtt');

exports.getMarinaDockings = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation, Docking, Transaction} = models;
    const { marinaId } = req.params;
    const buf = Buffer.from('info');
    client.publish('getInfos', buf);
    var options = { replacements: [marinaId], type: sequelize.QueryTypes.SELECT, model: Docking,
        hasJoin: true,
        include: [{
            model: Transaction
        }] 
    };
    Docking._validateIncludedElements(options);

    const query = `
        select d.*, SUM(t.amount) as amount, u."fullName", r."fromDate", r."toDate", p.id as pedestalId, m.id as marinaid, p.name as pedestalName, b.id as berthid, b.name as berthName, b."isWaterEnabled" as water, b."isElectricityEnabled" as electricity
        from 
            dockings d,
            users u,
            reservations r,
            pedestals p,
            berths b,
            marinas m,
            transactions t
        where
            r."userId" = u.id and
            d."reservationId" = r.id and
            r."berthId" = b.id and
            b."pedestalId" = p.id and
            p."marinaId" = m.id and
            t."dockingId" = d.id and
            m.id = ?
        GROUP BY d.id, u."fullName", r."fromDate", r."toDate", p.id, m.id, p.name, b.name, b.id, b."isWaterEnabled", b."isElectricityEnabled";
    `

    sequelize.query(query, options)
    .then(result => {
        res.status(200).json(result);
    }).catch(err => {
        return error(res, err.message);
    });
};

exports.closeDocking = async(req, res, next) => {
    const {Docking, Reservation, Berth} = models;
    const { marinaId, dockingId } = req.params;
    try {
        const docking = await Docking.findOne({where: {id: dockingId}, include: [ Reservation ]});
        docking.isClosed = true;
        docking.save().then(() => {
            const berthId = docking.reservation.berthId;
            Berth.findOne({where: {id: berthId}}).then(berth => {
                berth.isElectricityEnabled = false;
                berth.isWaterEnabled = false;
                berth.save().then(() => {
                    const buf = Buffer.from('reset');
                    client.publish(berth.id, buf);
                    res.status(200).json(docking);
                }).catch(err => error(res, err.message));
            }).catch(err => error(res, err.message));
        }).catch(err => error(res, err.message));
    } catch(err) {
        return error(res, err.message);
    }
}

exports.addAmount = async(req, res, next) => {
    const {Docking, Transaction} = models;
    const { dockingId } = req.params;
    const { amount } = req.body;
    const { userId } = req.userData;

    if (!amount) {
        return error(res, "Amount should be greater than 0");
    }

    try {
        const docking = await Docking.findOne({where: {id: dockingId}});

        if (docking) {
            Transaction.create({
                dockingId: docking.id,
                reservationId: docking.reservationId,
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