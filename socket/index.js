const socketIo = require( 'socket.io' );
const db = require('../db');
const lobby = require('../routes/lobby');

users = [];
connections = [];

const init = (server ) => {
  const io = socketIo(server)

  io.on('connection', function (socket) {
    connections.push(socket);
    console.log('%s Connected: %s sockets connected', socket.id, connections.length);
    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('%s Disconnected: %s sockets connected', socket.id, connections.length);
    });
    socket.on('chat message', function (data) {
        io.emit('chat send', { msg: data.message, user: data.username });
    });
  });
};

module.exports = { init }