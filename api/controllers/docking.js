const models = require('../models');
const error = require('../helpers/error-handler');
const Sequelize = require('sequelize');

exports.getMarinaDockings = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation, Docking, Transaction} = models;
    const { marinaId } = req.params;

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
    const {Docking} = models;
    const { marinaId, dockingId } = req.params;
    try {
        const docking = await Docking.findOne({where: {id: dockingId}});
        docking.isClosed = true;
        docking.save().then(() => {
            res.status(200).json(docking);
        }).catch(err => error(res, err.message));
    } catch(err) {
        return error(res, err.message);
    }
}