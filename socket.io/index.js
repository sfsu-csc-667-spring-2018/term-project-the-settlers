
module.export = function(server){

    let io;

    if (server) {
       io = require('socket.io').listen(server);
      
    }

    return io;
}