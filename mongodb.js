const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://root:admin@marinadb-f04h0.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoDB, { useNewUrlParser: true }, function() {
    console.log('Connected to mongo');
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;