const express = require("express");

const AuthRoutes = require("./auth");
const UserRoutes = require("./user");
const MarinaRoutes = require("./marina");
const TestRoutes = require("./test");
const StatsRoute = require("./stats");

module.exports = function(app, io, mqtt) {
  app.use("/api/auth", AuthRoutes);
  app.use("/api/user", UserRoutes);
  app.use("/api/test", TestRoutes);
  app.use("/api/marina", MarinaRoutes);
  app.use("/api/stats", StatsRoute);
};

// module.exports = router;
