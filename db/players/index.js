module.exports = function(db){
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
    return db.one('INSERT INTO "player_resources" (player_id,game_id,resource_id,type,count) '
                  + 'VALUES ($1,$2,$3,$4,$5) RETURNING id', [playerId,gameId,resource.id,type,count]);

  }

  playerFunctions.getResources = (playerId,gameId) => {
    return db.any('SELECT id,resource_type, count FROM "player_resources" '
                  + 'WHERE player_id = $1 AND game_id = $2',[playerId,gameId]);
  }

  playerFunctions.updateResources = (playerId,gameId,type,additional) =>{
    return db.one('UPDATE "player_resources" SET count = count + $1' +
                  'WHERE player_id = $2 AND game_id = $3',[additional,playerId,gameId]);
  }
  return playerFunctions;
}
