var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var connectionSchema = new Schema({
  name: String,
  socket_id: { type: String, required: true },
  pedestal_id: { type: String, required: true },
});

var Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;