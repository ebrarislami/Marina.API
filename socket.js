var socketio = require('socket.io')

module.exports.listen = function(server){
    io = socketio.listen(server)
    io.on('connection', function(socket){
        console.log('User Connected: ' + socket.id);

        socket.on('join', function(data) {
            socket.join(socket.id);
        });
    });
    
    return io
}