'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Dev_Cards',{
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        id:{
          type:Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        user_id:{
          type: Sequelize.INTEGER
        },
        game_id:{
          type: Sequelize.INTEGER
        },
        dev_card_type:{
          type: Sequelize.STRING,
          allowNull: false
        }
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Dev_Cards');
  }
};
