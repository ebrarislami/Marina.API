const express = require('express');
const router = express.Router();
const TestController = require('../controllers/test');
const isAdmin = require('../middleware/check-admin');
const isAuth = require('../middleware/check-auth');

router.get('/', TestController.getTest);
router.post('/', TestController.postTest);

module.exports = router;