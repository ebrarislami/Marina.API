const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', UserController.getUsers);

module.exports = router;