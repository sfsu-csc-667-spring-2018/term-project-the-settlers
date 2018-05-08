'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('games',{
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      game_name: {
        type: Sequelize.STRING,
        unique:true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  }
};
