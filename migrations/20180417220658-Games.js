'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Games',{
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Games');
  }
};
