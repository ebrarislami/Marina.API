const express = require('express');
const http = require('http')
const app = express();
const server = http.createServer(app)
// const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Sequelize = require('sequelize');
const sequelize = require('./db');
const models = require('./api/models');
require('dotenv').config()
// app.set('socketio', io);

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

const AuthRoutes = require('./api/routes/auth');
const UserRoutes = require('./api/routes/user');
const MarinaRoutes = require('./api/routes/marina');
const TestRoutes = require('./api/routes/test');

const io = require('./socket').listen(server)

require('./api/routes/index')(app,io);

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

server.listen(PORT, () => console.log('Server is running'));

// io.on('connection', (socket) => {
//     console.log('New User connected')
// });

// models.sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//       console.log('Server is up and running');
//     });
// });

module.exports = app;
