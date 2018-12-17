const express = require('express');

const AuthRoutes = require('./auth');
const UserRoutes = require('./user');
const MarinaRoutes = require('./marina');
const TestRoutes = require('./test');

module.exports = function(app, io, mqtt) {
    app.use('/api/auth', AuthRoutes);
    app.use('/api/user', UserRoutes);
    app.use('/api/test', TestRoutes);
    app.use('/api/marina', MarinaRoutes);
}

// module.exports = router;
