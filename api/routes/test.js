const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');
const MarinaRoutes = require('./marina');

    router.get('/wateron', TestController.waterOn);
    router.get('/wateroff', TestController.waterOff);
    router.get('/electricityon', TestController.electricityOn);
    router.get('/electricityoff', TestController.electricityOff);
    router.post('/', TestController.postTest);

module.exports = router;
