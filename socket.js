var socketio = require('socket.io')
var Connection = require('./api/models/connections');

module.exports.listen = function(server){
    io = socketio.listen(server)
    io.on('connection', function(socket){

        // Connection.find({}, function(err, connections) {
        //     console.log(connections);
        //   });

        console.log('User Connected: ' + socket.id);
        
        socket.on('join', function(data) {
            Connection.create({socket_id: socket.id, pedestal_id: '1'}).then(result => {
                socket.join(socket.id);
            });
        });

        socket.on('disconnect', function() {
            Connection.findOneAndRemove({ socket_id: socket.id }, function(err) {
                if (err) throw err;
                console.log('User Disconnected: ' + socket.id);
              });
        });
    });
    
    return io
}