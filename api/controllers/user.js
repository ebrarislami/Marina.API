const models = require('../models');
const error = require('../helpers/error-handler');
const client = require('../../mqtt');


exports.getUsers = async(req, res, next) => {
    const { User, Yacht } = models;
    try {
        const users = await User.findAll({include: [Yacht]});
        res.status(200).json(users);
    } catch(err) {
        return error(res, err.message);
    }
};

exports.getUserDockings = async(req, res, next) => {
    const { Docking, Transaction } = models;
    const { userId } = req.params;
    const buf = Buffer.from('info');
    client.publish('getInfos', buf);
    var options = { replacements: [userId], type: sequelize.QueryTypes.SELECT, model: Docking,
        hasJoin: true,
        include: [{
            model: Transaction
        }] 
    };
    Docking._validateIncludedElements(options);

    const query = `
        select d.*, SUM(t.amount) as amount, u."fullName", r."fromDate", r."toDate", p.id as pedestalId, p.name as pedestalName, b.id as berthid, b.name as berthName, b."isWaterEnabled" as water, b."isElectricityEnabled" as electricity
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
            t."dockingId" = d.id and
            u.id = ?
        GROUP BY d.id, u."fullName", r."fromDate", r."toDate", p.id, p.name, b.name, b.id, b."isWaterEnabled", b."isElectricityEnabled";
    `

    setTimeout(() => {
        sequelize.query(query, options)
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            return error(res, err.message);
        });
    }, 100);
};

exports.getUserTransactions = async(req, res, next) => {
    const { User, Transaction } = models;
    const { userId } = req.userData;
    try {
        const transactions = await Transaction.findAll({where: {userId: userId}});
        res.status(200).json(transactions);
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