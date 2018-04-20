'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Player_Resources',
            {
                createdAt: Sequelize.DATE,
                updatedAt: Sequelize.DATE,
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                player_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true
                },
                game_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true
                },
                resource_id: {
                    type: Sequelize.INTEGER,
                    unique: true
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Player_Resources');
    }
};
