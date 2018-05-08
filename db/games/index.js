module.exports = (db) => {
    const gameFunctions = {};

    gameFunctions.createGame = (gameName) => {
      return db.one('INSERT INTO "games" (game_name) VALUES($1) RETURNING id,game_name',[gameName]);
    }

    gameFunctions.getGames = () => {
      return db.any('SELECT game_id FROM "players" ' +
                    'GROUP BY game_id ' +
                    'HAVING COUNT(*) < 4 ');
    }

    gameFunctions.addPlayer = (gameId,userId,turnNum, currentTurn = 'N') =>{
      return db.one('INSERT INTO "players" (game_id,user_id,turn_order,current_turn)' +
                    'VALUES ($1,$2,$3,$4) RETURNING id', [gameId,userId,turnNum,currentTurn]);
    }

    gameFunctions.getPlayerCount = (gameId) => {
      return db.one('SELECT COUNT(*) FROM "players" WHERE game_id = $1', [gameId]);
    }

    gameFunctions.addVertex = (vertexNumber,gameId, robber = false) => {
          return db.one('INSERT INTO "vertices" (vertex_number,game_id,robber)'+
                        ' VALUES ($1,$2,$3) RETURNING id'
                        ,[vertexNumber,gameId,robber]);
    }

    gameFunctions.addPortToVertex = (vertexNumber, gameId, requiredResourceType) => {
      return db.tx('addPortTransaction'
                  ,t => t.one('SELECT id FROM "ports" WHERE UPPER(resource_in_type) = UPPER($1)'
                            ,[requiredResourceType])
                  .then(port => {
                                  if(port){
                                      return t.none('UPDATE "vertices" set port_id = $1'
                                            +'WHERE vertex_number = $2 '
                                            +'AND game_id = $3', [port.id,vertexNumber,gameId])
                                  }
                                  return [];
                   })
      )}


    gameFunctions.moveRobber = (vertexNumber,gameId) =>{
      return db.tx('moveRobberTransaction',
                t => {
                      t.none('UPDATE "vertices" SET robber = $1 '
                            +'WHERE game_id = $2', [false,gameId])
                      .then( () =>  t.none('UPDATE "vertices" SET robber = $1 '
                                  +'WHERE vertex_number = $2 AND game_id = $3',
                                  [true,vertexNumber,gameId])
                      .catch(error => ( error))
                  )}
    )}

    gameFunctions.findVertexId = (vertexNumber,game) => {
      return db.one('SELECT id FROM "vertices"'
                    +' WHERE vertex_number = $1 AND game_id = $2 '
                    ,[vertexNumber,gameId]);
    }

    gameFunctions.getVertices = (gameId) => {
      return db.many('SELECT vertex_number,robber,player_id,building_type,port_id '
                    +'FROM "vertices" LEFT JOIN "buildings" '
                    +'ON "vertices".building_id = "buildings".id '
                    +'WHERE game_id = $1', [gameId]);
    }

    gameFunctions.getRoads = (gameId) => {
      return db.many('SELECT  player_id,v_start.vertex_number vertex_start,v_end.vertex_number vertex_end'
                      +' FROM "connections"'
                      +'INNER JOIN "vertices" v_start ON (v_start.id = "connections".vertex_start)'
                      +'INNER JOIN "vertices" v_end ON (v_end.id = "connections".vertex_end)'
                      +'WHERE "connections".game_id = $1',[gameId]);
    }
    return gameFunctions;
}
