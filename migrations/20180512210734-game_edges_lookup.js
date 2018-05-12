'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface
    .createTbale("game_edges_lookup", {
      x_start: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      y_start: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      x_end: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      y_end: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    })
    .then(()=> {
      return queryInterface.bulkInsert
      ("game_edges_lookup", [
        {x_start:2 , y_start:1,  x_end:3, y_end:0 },
        {x_start:3 , y_start:0,  x_end:4, y_end:1 },
        {x_start:4 , y_start:1,  x_end:5, y_end:0 },
        {x_start:5 , y_start:0,  x_end:6, y_end:1 },
        {x_start:6 , y_start:1,  x_end:7, y_end:0 },
        {x_start:7 , y_start:0,  x_end:8, y_end:1 },
        {x_start:2 , y_start:1,  x_end:2, y_end:2},
        {x_start:4 , y_start:1,  x_end:4, y_end:2},
        {x_start:6 , y_start:1,  x_end:6, y_end:2},
        {x_start:8 , y_start:1,  x_end:8, y_end:2},
        {x_start:1 , y_start:3,  x_end:2, y_end:2},
        {x_start:2 , y_start:2,  x_end:3, y_end:3 },
        {x_start:3 , y_start:3,  x_end:4, y_end:2 },
        {x_start:4 , y_start:2,  x_end:5, y_end:3 },
        {x_start:5 , y_start:3,  x_end:6, y_end:2 },
        {x_start:6 , y_start:2,  x_end:7, y_end:3 },
        {x_start:7 , y_start:3,  x_end:8, y_end:2 },
        {x_start:8 , y_start:2,  x_end:9, y_end:3 },
        {x_start:1 , y_start:3,  x_end:1, y_end:4 },
        {x_start:3 , y_start:3,  x_end:3, y_end:4 },
        {x_start:5 , y_start:3,  x_end:5, y_end:4 },
        {x_start:7 , y_start:3,  x_end:7, y_end:4 },
        {x_start:9 , y_start:3,  x_end:9, y_end:4 },
        {x_start:0 , y_start:5,  x_end:1, y_end:4 },
        {x_start:1 , y_start:4,  x_end:2, y_end:5 },
        {x_start:2 , y_start:5,  x_end:3, y_end:4 },
        {x_start:3 , y_start:4,  x_end:4, y_end:5 },
        {x_start:4 , y_start:5,  x_end:5, y_end:4 },
        {x_start:5 , y_start:4,  x_end:6, y_end:5 },
        {x_start:6 , y_start:5,  x_end:7, y_end:4 },
        {x_start:7 , y_start:4,  x_end:8, y_end:5 },
        {x_start:8 , y_start:5,  x_end:9, y_end:4 },
        {x_start:9 , y_start:4,  x_end:10, y_end:5 },
        {x_start:0 , y_start:5,  x_end:0, y_end:6 },
        {x_start:2 , y_start:5,  x_end:2, y_end:6 },
        {x_start:4 , y_start:5,  x_end:4, y_end:6 },
        {x_start:6 , y_start:5,  x_end:6, y_end:6 },
        {x_start:8 , y_start:5,  x_end:8, y_end:6 },
        {x_start:10 , y_start:5,  x_end:10, y_end:6 },
        {x_start:0 , y_start:6,  x_end:1, y_end:7 },
        {x_start:1 , y_start:7,  x_end:2, y_end:6 },
        {x_start:2 , y_start:6,  x_end:3, y_end:7},
        {x_start:3 , y_start:7,  x_end:4, y_end:6 },
        {x_start:4 , y_start:6,  x_end:5, y_end:7 },
        {x_start:5 , y_start:7,  x_end:6, y_end:6 },
        {x_start:6 , y_start:6,  x_end:7, y_end:7 },
        {x_start:7 , y_start:7,  x_end:8, y_end:6 },
        {x_start:8 , y_start:6,  x_end:9, y_end:7 },
        {x_start:9 , y_start:7,  x_end:10, y_end:6 },
        {x_start:1 , y_start:7,  x_end:1, y_end:8 },
        {x_start:3 , y_start:7,  x_end:3, y_end:8 },
        {x_start:5 , y_start:7,  x_end:5, y_end:8 },
        {x_start:7 , y_start:7,  x_end:7, y_end:8 },
        {x_start:9 , y_start:7,  x_end:9, y_end:8 },
        {x_start:1 , y_start:8,  x_end:2, y_end:9 },
        {x_start:2 , y_start:9,  x_end:3, y_end:8 },
        {x_start:3 , y_start:8,  x_end:4, y_end:9 },
        {x_start:4 , y_start:9,  x_end:5, y_end:8 },
        {x_start:5 , y_start:8,  x_end:6, y_end:9 },
        {x_start:6 , y_start:9,  x_end:7, y_end:8 },
        {x_start:7 , y_start:8,  x_end:8, y_end:9 },
        {x_start:8 , y_start:9,  x_end:9, y_end:8 },
        {x_start:2 , y_start:9,  x_end:2, y_end:10 },
        {x_start:4 , y_start:9,  x_end:4, y_end:10 },
        {x_start:6 , y_start:9,  x_end:6, y_end:10 },
        {x_start:8 , y_start:9,  x_end:8, y_end:10 },
        {x_start:2 , y_start:10,  x_end:3, y_end:11 },
        {x_start:3 , y_start:11,  x_end:4, y_end:10 },
        {x_start:4 , y_start:10,  x_end:5, y_end:11 },
        {x_start:5 , y_start:11,  x_end:6, y_end:10 },
        {x_start:6 , y_start:10,  x_end:7, y_end:11 },
        {x_start:7 , y_start:11,  x_end:8, y_end:10 }

      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable("game_edges_lookup");
  }
};
