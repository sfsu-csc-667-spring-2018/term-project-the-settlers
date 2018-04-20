'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'Connections',
            {
                createdAt: Sequelize.DATE,
                updatedAt: Sequelize.DATE,
                connection_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                vertex_start: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                vertex_end: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true
                },
                game_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    unique: true
                }
            }
        );
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Connections');
    }
};