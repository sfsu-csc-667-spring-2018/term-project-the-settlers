module.exports = (db) => {
  const playerFunctions = {};

  playerFunctions.addDevCard = (playerId, gameId, devCard) => {
      return db.none('INSERT INTO "dev_cards" (player_id,game_id,dev_card_type)' +
                    'VALUES ($1,$2,$3)', [playerId,gameId,devCard]);
  }

  playerFunctions.findPlayerGame = (userId) => {
    return db.one('SELECT game_id FROM "players" WHERE user_id = $1',
                  [userId]);
  }

  playerFunctions.findPlayerId = (userId) => {
    return db.one('SELECT id FROM "players" WHERE user_id = $1',[userId]);
  }

  playerFunctions.addResource = (playerId,gameId,type,count) => {
    return db.one('INSERT INTO "player_resources" (player_id,game_id,resource_type,count) '
                  + 'VALUES ($1,$2,$3,$4) RETURNING id', [playerId,gameId,type,count]);

  }

  playerFunctions.getResources = (playerId,gameId) => {
    return db.any('SELECT resource_type, count FROM "player_resources" '
                  + 'WHERE player_id = $1 AND game_id = $2',[playerId,gameId]);
  }

  playerFunctions.updateResources = (playerId,gameId,type,additional) =>{
    return db.none('UPDATE "player_resources" SET count = count + $1'
                  +' WHERE player_id = $2' +
                    'AND game_id = $3'
                    +'AND UPPER(resource_type) = UPPER($4)',
                    [additional,playerId,gameId,type]);
  }

  playerFunctions.buildBuilding = (playerId,buildingType,vertexNumber,gameId) => {
    return db.tx('buildBuidingTransaction',
                  t => {t.one('INSERT INTO "buildings" (player_id,building_type)'
                              +' VALUES ($1,$2) RETURNING id',[playerId,buildingType])
                        .then( building => {
                                              if(building){
                                                return t.none('UPDATE "vertices" '
                                                      + 'SET building_id = $1'
                                                      +'WHERE vertex_number = $2'
                                                      + 'AND game_id = $3'
                                                      ,[building.id,vertexNumber,gameId])
                                              }
                                                return [];
                                            }
                        ).catch(error => (error))
                      })
  }

  playerFunctions.buildRoad = (playerId,gameId,vertexStartId,vertexEndId) =>{
    return db.one('INSERT into "connections" (vertex_start,vertex_end,player_id,game_id)'
            +' VALUES ($1,$2,$3,$4) RETURNING connection_id', [vertexStartId,vertexEndId,playerId,gameId]);
  }

  playerFunctions.getOwnedRoads = (playerId,gameId) => {
    return db.many('SELECT * FROM "connections" WHERE player_id = $1 AND game_id = $2',
                  [playerId,gameId]);
  }

  return playerFunctions;
}
