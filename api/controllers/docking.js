const models = require("../models");
const error = require("../helpers/error-handler");
const Sequelize = require("sequelize");
const client = require("../../mqtt");

exports.getMarinaDockings = async (req, res, next) => {
  const { Marina, Pedestal, Berth, Reservation, Docking, Transaction } = models;
  const { marinaId } = req.params;
  const { userId, role } = req.userData;
  const buf = Buffer.from("info");
  client.publish("getInfos", buf);
  var options = {
    replacements: [marinaId, userId],
    type: sequelize.QueryTypes.SELECT,
    model: Docking,
    hasJoin: true,
    include: [
      {
        model: Transaction
      }
    ]
  };
  Docking._validateIncludedElements(options);

  const queryAdmin = `
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
        GROUP BY b.name, u."fullName", r."fromDate", r."toDate", p.id, m.id, p.name, d.id, b.id, b."isWaterEnabled", b."isElectricityEnabled";
    `;

  const queryUser = `
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
        m.id = ? and r."userId" = ?
    GROUP BY b.name, u."fullName", r."fromDate", r."toDate", p.id, m.id, p.name, d.id, b.id, b."isWaterEnabled", b."isElectricityEnabled";
`;

  if (role === "User") {
    setTimeout(() => {
      sequelize
        .query(queryUser, options)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => {
          return error(res, err.message);
        });
    }, 100);
  } else {
    setTimeout(() => {
      sequelize
        .query(queryAdmin, options)
        .then(result => {
          res.status(200).json(result);
        })
        .catch(err => {
          return error(res, err.message);
        });
    }, 100);
  }
};

exports.closeDocking = async (req, res, next) => {
  const { Docking, Reservation, Berth } = models;
  const { dockingId } = req.params;
  try {
    const docking = await Docking.findOne({
      where: { id: dockingId },
      include: [Reservation]
    });
    docking.isClosed = true;
    docking
      .save()
      .then(() => {
        const berthId = docking.reservation.berthId;
        Berth.findOne({ where: { id: berthId } })
          .then(berth => {
            berth.isElectricityEnabled = false;
            berth.isWaterEnabled = false;
            berth.isAvailable = true;
            berth
              .save()
              .then(() => {
                const buf = Buffer.from("reset");
                client.publish(berth.id, buf);
                const objE = {
                  electricity: "Off"
                };
                const bufE = Buffer.from(JSON.stringify(objE));
                client.publish(berth.id, bufE);
                const objW = {
                  Water: "Off"
                };
                const bufW = Buffer.from(JSON.stringify(objW));
                client.publish(berth.id, bufW);
                res.status(200).json(docking);
              })
              .catch(err => error(res, err.message));
          })
          .catch(err => error(res, err.message));
      })
      .catch(err => error(res, err.message));
  } catch (err) {
    return error(res, err.message);
  }
};

exports.addAmount = async (req, res, next) => {
  const { Docking, Transaction } = models;
  const { dockingId } = req.params;
  const { amount } = req.body;
  const { userId } = req.userData;

  if (!amount) {
    return error(res, "Amount should be greater than 0");
  }

  try {
    const docking = await Docking.findOne({ where: { id: dockingId } });

    if (docking) {
      Transaction.create({
        dockingId: docking.id,
        reservationId: docking.reservationId,
        amount: amount,
        userId: userId
      })
        .then(transaction => {
          res.status(200).json(transaction);
        })
        .catch(err => {
          return error(res, err.message);
        });
    } else {
      return error(res, "Docking not found!");
    }
  } catch (err) {
    return error(res, err.message);
  }
};
