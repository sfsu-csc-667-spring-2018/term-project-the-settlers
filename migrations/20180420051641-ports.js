"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ports", {
      createdAt: Sequelize.DATE,
      /*
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.fn('NOW')
                */
      updatedAt: Sequelize.DATE,
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      resources_in_required: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resources_out_required: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      resource_in_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resource_out_type: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Ports");
  }
};
