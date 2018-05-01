module.exports = function(db){
    const gameFunctions = {};

    gameFunctions.createGame = () => {
      return db.one('INSERT INTO "games" VALUES(NULL) RETURNING id');
    }

    gameFunctions.getGames = () => {
      return db.any('SELECT game_id FROM "players" ' +
                    'GROUP BY game_id ' +
                    'HAVING COUNT(*) < 4 ');
    }

    gameFunctions.addPlayer = (gameId,userId,turnNum, currentTurn) =>{
      return db.one('INSERT INTO "players" (game_id,user_id,turn_order,current_turn)' +
                    'VALUES ($1,$2,$3,$4) RETURNING id', [gameId,userId,turnNum,currentTurn]);
    }

    gameFunctions.getPlayerCount = (gameId) => {
        return db.one('SELECT COUNT(*) FROM "players" WHERE game_id = $1', [gameId]);
    }

    return gameFunctions;
}
