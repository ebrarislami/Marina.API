const express = require('express');
const router = express.Router();
const MarinaController = require('../controllers/marina');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', MarinaController.getUsers);

module.exports = router;