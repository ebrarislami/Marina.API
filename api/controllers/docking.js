const models = require('../models');
const error = require('../helpers/error-handler');

exports.getMarinaDockings = async(req, res, next) => {
    const {Marina, Pedestal, Berth, Reservation} = models;
    const { marinaId } = req.params;
    sequelize.query(`
        select d.*, p.id as pedestalId, m.id as marinaid, p.name as pedestalName, b.name as berthName
        from 
        dockings d,
        reservations r,
        berths b,
        pedestals p,
        marinas m
        where
            d."reservationId" = r.id and
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