const socketIo = require( 'socket.io' );
const db = require('../db');
const lobby = require('../routes/lobby');

users = [];
connections = [];

var datas = db.username;


const init = (server ) => {
  const io = socketIo(server)

  io.on('connection', function (socket) {
    connections.push(socket);
    console.log('%s Connected: %s sockets connected', socket.id, connections.length);
    db.users.findByUserId(connections.length)
            .then( (successMsg) =>  {
                socket.username = successMsg.username;
                users.push(socket.username);
                                    }
            ).catch( (rejectMsg) => {
                console.log('not found')
                                    }
            );
    
    socket.on('disconnect', function () {
        users.splice(users.indexOf(socket.username), 1);
        connections.splice(connections.indexOf(socket), 1);
        console.log('%s Disconnected: %s sockets connected', socket.id, connections.length);
    });
    socket.on('chat message', function (message) {
        if (socket.username) {
            io.emit('chat send', { msg: message, user: socket.username });
        } else {
            io.emit('chat send', { msg: message, user: 'not found' });
        }
    });
  });
};

module.exports = { init }