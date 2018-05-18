const allProbs = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];

function shuffle(array) {
  const result = array.map(i => i);

  var currentIndex = result.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = result[currentIndex];
    result[currentIndex] = result[randomIndex];
    result[randomIndex] = temporaryValue;
  }

  return result;
}

const intializeGame = (db,gameName,playerLimit) =>
  Promise.all([
    db.one('INSERT INTO "games" (game_name,player_limit) VALUES($1,$2) RETURNING id',
            [gameName,playerLimit]),
    db.many("SELECT * FROM tiles WHERE id != 1 ORDER BY RANDOM()")
  ]);

const insertGameTiles = db => ([game, tiles]) => {
  const desertPlacementOrder = Math.floor(Math.random() * 20);
  const queries = shuffle(allProbs).map((probability, index) => {
    let order = index >= desertPlacementOrder ? index+1 : index;
    return db.none(
      "INSERT INTO game_tiles VALUES(${game_id}, ${tile_id}, ${probability}, ${order}, ${robber})",
      {
        game_id: game.id,
        tile_id: tiles[index].id,
        probability,
        order,
        robber: false
      }
    )
  });
  queries.push(insertGameVertices(db)(game.id));
  queries.push(game);
  queries.push(insertDesertTile(db)(game.id,desertPlacementOrder));

  return Promise.all(queries);
};

const insertDesertTile = db => (gameId,order) =>{
  db.none(
    "INSERT INTO game_tiles VALUES(${game_id}, ${tile_id}, ${probability}, ${order}, ${robber})"
    ,
    {
      game_id: gameId,
      tile_id: 1,
      probability: 0,
      order,
      robber: true
    }
  )
}



const insertGameEdges = db => result => {
  const game = result[allProbs.length + 1];
  const query = db.none(`INSERT INTO game_edges (x_start,y_start,x_end,y_end,game_id) SELECT edge.x_start, edge.y_start, edge.x_end,edge.y_end,${game.id}`
                  +" FROM game_edges_lookup edge");
  return Promise.all([query,game]);
};

const insertGameVertices = db => gameId => {
  db.none(
    "INSERT INTO game_vertices (x, y, port_id, item, game_id) SELECT v.x, v.y, v.port_id, 'empty', $1 FROM game_vertex_lookup v",
    [gameId]
  );
};

const getPlayerInfo = db => (gameId) => {
  return db.any('SELECT username, turn_order,card_count,resource_count  FROM players'
          +' INNER JOIN users ON users.id = players.user_id'
          +' LEFT JOIN (SELECT COUNT(*) AS card_count,player_id'
          +'             FROM dev_cards GROUP BY player_id) cards ON cards.player_id = players.id '
          +' LEFT JOIN (SELECT SUM(count) AS resource_count, player_id'
          + '           FROM player_resources GROUP BY player_id) resources'
          +' ON resources.player_id = players.id'
          +' WHERE game_id = $1' , [gameId] );
};

const getPlayerResources = db => (gameId) => {
  return db.any('SELECT SUM(count) FROM player_resources GROUP BY player_id WHERE game_id = $1,')
};

module.exports = db => {
  const gameFunctions = {};

  gameFunctions.createGame = (gameName,playerLimit) =>
    intializeGame(db,gameName,playerLimit)
      .then(insertGameTiles(db))
      .then(insertGameEdges(db))
      .then(result => result[1]);

  gameFunctions.getGame = id =>
    Promise.all([
      db.one("SELECT * FROM games WHERE id=$1", [id]),
      db.many(
        "SELECT * FROM game_tiles JOIN tiles ON id=tile_id WHERE game_id=$1 ORDER BY game_tiles.order",
        [id]
      ),
      db.many("SELECT * FROM game_vertices WHERE game_id=$1", [id]),
      db.many("SELECT * FROM game_edges WHERE game_id=$1", [id]),
      getPlayerInfo(db)(id),

    ]).then(([game, tiles, vertices, edges, playerInfo]) => ({
      game,
      tiles,
      vertices,
      edges,
      playerInfo
    }));

  gameFunctions.getGames = () => {
    return db.any('SELECT id,game_name,player_limit,p.player_count FROM "games" g '
                  +'INNER JOIN (SELECT game_id, COUNT(*) AS player_count '
                  +              'FROM "players" GROUP BY game_id) p '
                  +'ON p.game_id = g.id '
                  +'WHERE p.player_count < g.player_limit');
  }

  gameFunctions.addPlayer = (gameId, userId, turnNum, currentTurn = "N") => {
    return db.one(
      'INSERT INTO "players" (game_id,user_id,turn_order,current_turn)' +
        "VALUES ($1,$2,$3,$4) RETURNING id",
      [gameId, userId, turnNum, currentTurn]
    );
  };

  gameFunctions.getPlayerCount = (gameId) => {
      return db.oneOrNone('SELECT player_limit, p.player_count '
                +'FROM "games" INNER JOIN'
                +   '(SELECT COUNT(*) AS player_count,game_id  FROM "players" '
                +   ' GROUP BY game_id) p '
                +'ON games.id = p.game_id '
                +'WHERE game_id = $1', [gameId]);
  }


  gameFunctions.moveRobber = (gameTileOrder, gameId) => {
    return db.tx("moveRobberTransaction", t => {
      t
        .none('UPDATE "game_tiles" SET robber = $1 ' + "WHERE game_id = $2", [
          false,
          gameId
        ])
        .then(() =>
          t
            .none(
              'UPDATE "game_tiles" SET robber = $1 ' +
                "WHERE order = $2 AND game_id = $3",
              [true, gameTileOrder, gameId]
            )
            .catch(error => error)
        );
    });
  };

  gameFunctions.getEdgeOwner = (xStart,yStart,xEnd,yEnd,gameId) => {
    return db.one('SELECT user_id FROM game_edges'
      +' WHERE x_start = $1 AND y_start = $2 AND x_end = $3 AND y_end =$4 AND game_id = $5'
        ,[xStart,yStart,xEnd,yEnd,gameId]);
  };

  gameFunctions.getVertexOwner = (x,y,gameId) => {
    return db.one('SELECT player_id FROM game_vertices WHERE x = $1 AND y = $2 AND game_id = $3'
                  ,[x,y,gameId]);
  };

  gameFunctions.getPlayersSettlementsPoints = (gameId) => {
    return db.any('SELECT player_id,COUNT(*) AS count FROM game_vertices WHERE game_id = $1 AND player_id != $2 '
                  +' AND UPPER(item) = UPPER($3) GROUP BY player_id'
                  ,[gameId,0,'SETTLEMENT']);
  };

  gameFunctions.getPlayersCityPoints = (gameId) => {
    return db.any('SELECT player_id,(2 * COUNT(*)) AS count FROM game_vertices WHERE game_id = $1 AND player_id != $2 '
                  +' AND UPPER(item) = UPPER($3) GROUP BY player_id'
                  ,[gameId,0,'CITY']);
  };

  gameFunctions.getPlayersRoads = (gameId) => {
    return db.any('SELECT x_start,y_start,x_end,y_end'
      +' WHERE player_id != $1 AND game_id = $2 AND road = $3'
      ,[0,gameId,true]);
  };

  gameFunction.getDevCardTypeCount(gameId,devCardType) => {
    return db.any('SELECT player_id,COUNT(*) FROM dev_cards'
      +'WHERE game_id = $1 AND UPPER(dev_card_type) = UPPER($2) GROUP BY player_id'
      ,[gameId,devCardType]);
  }
  return gameFunctions;
};
