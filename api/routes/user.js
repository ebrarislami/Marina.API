const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const ReservationController = require('../controllers/reservation');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', UserController.getUsers);
router.get('/:userId/reservations', isAuth, ReservationController.getUserReservations);
router.get('/:userId/transactions', isAuth, UserController.getUserTransactions);
router.get('/:userId/dockings', isAuth, UserController.getUserDockings);
router.post('/:userId/yacht', UserController.createUserYacht);

module.exports = router;