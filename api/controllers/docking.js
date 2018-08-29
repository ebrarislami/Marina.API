const models = require('../models');
const error = require('../helpers/error-handler');
const Sequelize = require('sequelize');

exports.getMarinaDockings = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation, Docking, Transaction} = models;
    const { marinaId } = req.params;

    var options = { replacements: [marinaId], type: sequelize.QueryTypes.SELECT };
    // console.log(Docking.validate);
    // options = sequelize.models.Docking.validateIncludeOptions(options, {InstantiatedAttribute: true});

    sequelize.query(`
        select d.*, u."fullName", r."fromDate", r."toDate", p.id as pedestalId, m.id as marinaid, p.name as pedestalName, b.name as berthName, b."isWaterEnabled" as water, b."isElectricityEnabled" as electricity
        from 
        dockings d,
        users u,
        reservations r,
        pedestals p,
        berths b,
        marinas m
        where
            r."userId" = u.id and
            d."reservationId" = r.id and
            r."berthId" = b.id and
            b."pedestalId" = p.id and
            p."marinaId" = m.id and
            m.id = ?;
    `, options)
    .then(result => {
        res.status(200).json(result);
    }).catch(err => {
        return error(res, err.message);
    });
};