const db = require('../db');

module.exports = function(server){
    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });
    });
}