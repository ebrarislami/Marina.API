const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const AuthRoutes = require('./api/routes/auth');
const UserRoutes = require('./api/routes/user');
const PedestalRoutes = require('./api/routes/pedestal');
const MarinaRoutes = require('./api/routes/marina');
const sequelize = require('./db');
const models = require('./api/models');
require('dotenv').config()
const app = express();

const path = require('path')
const PORT = process.env.PORT || 3000
const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
                "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 
                    "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use('/api/pedestals', PedestalRoutes);
app.use('/api/marina', MarinaRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(PORT, () => console.log('Server is running'))

// models.sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//       console.log('Your Server is up and running');
//     });
// });

module.exports = app;
