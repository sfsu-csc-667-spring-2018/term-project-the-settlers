const socketIo = require("socket.io");
const db = require("../db");
const lobby = require("../routes/lobby");
const game = require("../routes/game");

users = [];
connections = [];

const init = (server, app) => {
  const io = socketIo(server);
  app.set("io", io);

  const lobby = io.of("/lobby");
  const game = io.of("/game");

  io.on("connection", function(socket) {
    connections.push(socket);
    socket.on("disconnect", function() {
      users.splice(users.indexOf(socket.username), 1);
      connections.splice(connections.indexOf(socket), 1);
    });
  });
};

module.exports = { init };
