'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('Players', ['user_id'],{
                              type: 'foreign key',
                              name: 'player_user_id_fk',
                              references:{
                                  table:'Users',
                                  field:'id'
                              }
                            }
            )
            .then( () => queryInterface.addConstraint('Player_Resources', ['player_id'], {
                              type: 'foreign key',
                              name: 'player_resources_player_id_fk',
                              references:{
                                  table: 'Players',
                                  field: 'id'
                                },
                                onDelete:'cascade'
                            }
            ))
            .then( () => queryInterface.addConstraint('Player_Resources',['game_id'], {
                              type: 'foreign key',
                              name: 'player_resources_game_id_fk',
                              references:{
                                  table: 'Games',
                                  field: 'id'
                              },
                                onDelete: 'cascade'
                            }
            ))
            .then( () => queryInterface.addConstraint('Player_Resources', ['resource_id'], {
                              type: 'foreign key',
                              name: 'player_resources_resource_id_fk',
                              references:{
                                  table: 'Resources',
                                  field: 'id'
                              },
                                onDelete: 'cascade'
                            }
            ))
            .then( () => queryInterface.addConstraint('Buildings',['player_id'],{
                                type: 'foreign key',
                                name: 'buildings_player_id_fk',
                                references: {
                                  table: 'Players',
                                  field: 'id'
                                },
                                  onDelete: 'cascade'
                              }
            ))
            .then( () => queryInterface.addConstraint('Vertices',['game_id'],{
                                type: 'foreign key',
                                name: 'vertices_game_id_fk',
                                references: {
                                  table: 'Games',
                                  field: 'id'
                                },
                                onDelete: 'cascade'
                          }
            ))
            .then( () => queryInterface.addConstraint('Vertices',['building_id'],{
                                type: 'foreign key',
                                name: 'vertices_building_id_fk',
                                references: {
                                  table: 'Buildings',
                                  field: 'id'
                                },
                                onDelete: 'cascade'
                          }
            ))
            .then( () => queryInterface.addConstraint('Dev_Cards',['game_id'],{
                                type: 'foreign key',
                                name: 'dev_cards_game_id_fk',
                                references: {
                                  table: 'Games',
                                  field: 'id'
                                },
                                onDelete: 'cascade'
                          }
            ))
            .then( () => queryInterface.addConstraint('Dev_Cards',['player_id'],{
                            type: 'foreign key',
                            name: 'dev_cards_player_id_fk',
                            references: {
                                table: 'Players',
                                field: 'id'
                            },
                            onDelete: 'cascade'
                          }
            ))
            .then( () => queryInterface.addConstraint('Game_Resources',['vertex_id'],{
                            type: 'foreign key',
                            name: 'game_resources_vertex_id_fk',
                            references: {
                                table: 'Vertices',
                                field: 'id'
                            },
                            onDelete: 'cascade'
                          }
            ))
            .then( () => queryInterface.addConstraint('Connections', ['vertex_start'], {
                          type: 'foreign key',
                          name: 'connections_vertex_id_strt_fk',
                          references: {
                              table: 'Vertices',
                              field: 'id'
                          },
                          onDelete: 'cascade'
                        }
            ))
            .then( () => queryInterface.addConstraint('Connections', ['vertex_end'], {
                          type: 'foreign key',
                          name: 'connections_vertex_id_end_fk',
                          references: {
                              table: 'Vertices',
                              field: 'id'
                          },
                          onDelete: 'cascade'
                        }
            ));
  },

  down: (queryInterface, Sequelize) => {

  }
};
