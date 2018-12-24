const express = require("express");
const router = express.Router();
const Stats = require("../controllers/stats");
const isAdmin = require("../middleware/check-admin");
const isAuth = require("../middleware/check-auth");

router.get("/", Stats.getStats);
router.get("/totalHourConsumption", Stats.getHourConsumption);
router.get("/berthHourConsumption/:berthID", Stats.getBerthHourConsumption);

module.exports = router;
