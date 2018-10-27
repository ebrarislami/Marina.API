const express = require('express');
const router = express.Router();
const MarinaController = require('../controllers/marina');
const PedestalController = require('../controllers/pedestal');
const BerthController = require('../controllers/berth');
const ReservationController = require('../controllers/reservation');
const DockingController = require('../controllers/docking');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', MarinaController.getMarinas);
router.get('/:marinaId', MarinaController.getMarina);
router.get('/:marinaId/pedestals', isAuth, isAdmin, PedestalController.getAllMarinaPedestals);
router.post('/:marinaId/pedestals', isAuth, PedestalController.createMarinaPedestal);
router.get('/:marinaId/utilities', PedestalController.getAllMarinaPedestals);
router.get('/:marinaId/pedestals/:pedestalId', PedestalController.getPedestal);
router.get('/:marinaId/pedestals/:pedestalId/berths', isAuth, isAdmin, BerthController.getPedestalBerths);
router.get('/:marinaId/berths', isAuth, BerthController.getMarinaBerths);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId', isAuth, BerthController.getBerth);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId/toggleElectricity', isAuth, BerthController.toggleBerthElectricity);
router.get('/:marinaId/pedestals/:pedestalId/berths/:berthId/toggleWater', isAuth, BerthController.toggleBerthWater);

//Reservation Routes
router.get('/:marinaId/reservations', isAdmin, ReservationController.getMarinaReservations);
router.post('/:marinaId/reservations', isAuth, ReservationController.createReservation);
router.get('/:marinaId/reservations/:reservationId', ReservationController.getReservation);
router.get('/:marinaId/reservations/:reservationId/accept', ReservationController.acceptReservation);
router.get('/:marinaId/reservations/:reservationId/decline', ReservationController.declineReservation);
router.post('/:marinaId/reservations/:reservationId/start', isAuth, ReservationController.startReservation);

router.get('/:marinaId/dockings', isAdmin, DockingController.getMarinaDockings);
router.post('/:marinaId/dockings/:dockingId/addAmount', isAuth, DockingController.addAmount);
router.get('/:marinaId/dockings/:dockingId/close', isAuth, DockingController.closeDocking);

module.exports = router;