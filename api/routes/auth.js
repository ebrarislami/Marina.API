const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const checkAdmin = require('../middleware/check-admin');
const checkAuth = require('../middleware/check-auth');

router.post('/login', AuthController.login);
router.post('/signup', AuthController.signup);
// router.post('/forgotpassword', AuthController.forgotPassword);
// router.get('/resetpassword/:token', AuthController.resetPassword);

module.exports = router;
