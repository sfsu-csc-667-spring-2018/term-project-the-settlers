"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
      .createTable("game_vertex_lookup", {
        x: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        y: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        port_id: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      })
      .then(() => {
        return queryInterface.bulkInsert("game_vertex_lookup", [
          { x: 0, y: 5, port_id: 0 },
          { x: 1, y: 4, port_id: 0 },
          { x: 2, y: 5, port_id: 0 },
          { x: 2, y: 6, port_id: 0 },
          { x: 1, y: 7, port_id: 0 },
          { x: 0, y: 6, port_id: 0 }
          // DO MORE
        ]);
      });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable("game_vertex_lookup");
  }
};
