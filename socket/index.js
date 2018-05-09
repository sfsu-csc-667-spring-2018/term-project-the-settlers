const socketIo = require("socket.io");
const db = require("../db");
const lobby = require("../routes/lobby");

users = [];
connections = [];

const init = (server, app) => {
  const io = socketIo(server);
  app.set("io", io);

  const lobby = io.of("/lobby");
  const game = io.of("/game");

  io.on("connection", function(socket) {
    connections.push(socket);
    console.log(
      "%s Connected: %s sockets connected",
      socket.id,
      connections.length
    );
    socket.on("disconnect", function() {
      users.splice(users.indexOf(socket.username), 1);
      connections.splice(connections.indexOf(socket), 1);
      console.log(
        "%s Disconnected: %s sockets connected",
        socket.id,
        connections.length
      );
    });
  });

  lobby.on("connection", function(socket) {
    console.log("someone connected");
    socket.on("lobby send message", function(data) {
      lobby.emit("lobby receive message", {
        msg: data.message,
        user: data.username
      });
    });
  });

  game.on("connection", function(socket) {
    console.log("someone connected");
    socket.on("game send message", function(data) {
      game.emit("game receive message", {
        msg: data.message,
        user: data.username
      });
    });
  });
};

module.exports = { init };
