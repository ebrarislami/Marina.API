const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const ReservationController = require('../controllers/reservation');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', UserController.getUsers);
router.get('/:userId/reservations', ReservationController.getUserReservations);

module.exports = router;