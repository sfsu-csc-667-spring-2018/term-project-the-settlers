'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Resources', 
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        resource_type: {
          type: Sequelize.STRING,
          allowNull:false
        },
        count: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Resources');
  }
};
