const express = require('express');
const router = express.Router();
const PedestalController = require('../controllers/pedestal');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', isAuth, PedestalController.getAllMarinaPedestals);

module.exports = router;