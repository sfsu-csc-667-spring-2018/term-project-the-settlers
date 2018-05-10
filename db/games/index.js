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
    db.many("SELECT * FROM tiles ORDER BY RANDOM()")
  ]);

const insertGameTiles = db => ([game, tiles]) => {
  const queries = shuffle(allProbs).map((probability, index) =>
    db.none(
      "INSERT INTO game_tiles VALUES(${game_id}, ${tile_id}, ${probability}, ${order})",
      {
        game_id: game.id,
        tile_id: tiles[index].id,
        probability,
        order: index
      }
    )
  );
  queries.push(insertGameVertices(db)(game.id));
  queries.push(game);

  return Promise.all(queries);
};

const insertGameEdges = db => gameId => {};

const insertGameVertices = db => gameId => {
  db.none(
    "INSERT INTO game_vertices (x, y, port_id, item, game_id) SELECT v.x, v.y, v.port_id, 'empty', $1 FROM game_vertex_lookup v",
    [gameId]
  );
};

module.exports = db => {
  const gameFunctions = {};

  gameFunctions.createGame = (gameName,playerLimit) =>
    intializeGame(db,gameName,playerLimit)
      .then(insertGameTiles(db))
      .then(result => result[allProbs.length + 1]);

  gameFunctions.getGame = id =>
    Promise.all([
      db.one("SELECT * FROM games WHERE id=$1", [id]),
      db.many(

        "SELECT * FROM game_tiles JOIN tiles ON id=tile_id WHERE game_id=$1 ORDER BY game_tiles.order",
        [id]
      ),
      db.many("SELECT * FROM game_vertices WHERE game_id=$1", [id])
      // db.many("SELECT * FROM game_edges WHERE game_id=$1", [id])
    ]).then(([game, tiles, vertices, edges]) => ({
      game,
      tiles,
      vertices,
      edges
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

  gameFunctions.addVertex = (vertexNumber, gameId, robber = false) => {
    return db.one(
      'INSERT INTO "vertices" (vertex_number,game_id,robber)' +
        " VALUES ($1,$2,$3) RETURNING id",
      [vertexNumber, gameId, robber]
    );
  };

  gameFunctions.addPortToVertex = (
    vertexNumber,
    gameId,
    requiredResourceType
  ) => {
    return db.tx("addPortTransaction", t =>
      t
        .one(
          'SELECT id FROM "ports" WHERE UPPER(resource_in_type) = UPPER($1)',
          [requiredResourceType]
        )
        .then(port => {
          if (port) {
            return t.none(
              'UPDATE "vertices" set port_id = $1' +
                "WHERE vertex_number = $2 " +
                "AND game_id = $3",
              [port.id, vertexNumber, gameId]
            );
          }
          return [];
        })
    );
  };

  gameFunctions.moveRobber = (vertexNumber, gameId) => {
    return db.tx("moveRobberTransaction", t => {
      t
        .none('UPDATE "vertices" SET robber = $1 ' + "WHERE game_id = $2", [
          false,
          gameId
        ])
        .then(() =>
          t
            .none(
              'UPDATE "vertices" SET robber = $1 ' +
                "WHERE vertex_number = $2 AND game_id = $3",
              [true, vertexNumber, gameId]
            )
            .catch(error => error)
        );
    });
  };

  gameFunctions.findVertexId = (vertexNumber, game) => {
    return db.one(
      'SELECT id FROM "vertices"' +
        " WHERE vertex_number = $1 AND game_id = $2 ",
      [vertexNumber, gameId]
    );
  };

  gameFunctions.getVertices = gameId => {
    return db.many(
      "SELECT vertex_number,robber,player_id,building_type,port_id " +
        'FROM "vertices" LEFT JOIN "buildings" ' +
        'ON "vertices".building_id = "buildings".id ' +
        "WHERE game_id = $1",
      [gameId]
    );
  };

  gameFunctions.getRoads = gameId => {
    return db.many(
      "SELECT  player_id,v_start.vertex_number vertex_start,v_end.vertex_number vertex_end" +
        ' FROM "connections"' +
        'INNER JOIN "vertices" v_start ON (v_start.id = "connections".vertex_start)' +
        'INNER JOIN "vertices" v_end ON (v_end.id = "connections".vertex_end)' +
        'WHERE "connections".game_id = $1',
      [gameId]
    );
  };
  return gameFunctions;
};
