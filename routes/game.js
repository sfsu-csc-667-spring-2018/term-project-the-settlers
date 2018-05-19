const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/authenticated");
const db = require("../db");
const gameReady = require("../game_logic/game_ready")(db);
const gameLogic = require("../game_logic")(db);

const addPlayer = (userId,gameId) => {
  return db.games.getPlayerCount(gameId)
      .then( (players) => {
        if(players === null){
          return db.games.addPlayer(gameId,userId,1,'Y')
        }
        const {player_count: count, player_limit} = players;
        if(count < player_limit){
          return db.games.addPlayer(gameId,userId,parseInt(count)+1)
        }
      })
};

const addDefaultResources = (userId,gameId) => {
  return Promise.all([ db.players.addResource(userId, gameId, 'WHEAT', 0),
                      db.players.addResource(userId, gameId, 'ORE', 0),
                      db.players.addResource(userId, gameId, 'LUMBER', 0),
                      db.players.addResource(userId, gameId, 'WOOL', 0),
                      db.players.addResource(userId, gameId, 'BRICK', 0)
                    ])
}
const createGame = (gameName,playerLimit,userId) => {
  if(gameName !== undefined && playerLimit !== undefined){
    const gameCreation = db.games.createGame(gameName,playerLimit);
    const playerAddition = gameCreation
                          .then( ({id}) => addPlayer(userId, id));
    return Promise.all([gameCreation,playerAddition]);
  }
};

router.use(authenticate);

router.post("/", function(req, res, next) {
  const {lobby: gameName, playerLimit} = req.body;
  const{id:userId} = req.user;
  createGame(gameName,playerLimit,userId)
    .then( ([game,addPlayer]) => {
        addDefaultResources(userId,game.id)
        .then( () => res.redirect(`/game/${game.id}`))
    })
    .catch(error => {
      console.log(error);
      res.redirect('lobby');
    });
});

router.post("/join/:id",(request,response,next) => {
  const {id: userId} = request.user;
  const {id: gameId} = request.params;
  const playerAddition = addPlayer(userId,gameId);
  const addResources = playerAddition
                      .then( () => addDefaultResources(userId,gameId));

  Promise.all([playerAddition,addResources])
  .then( () => response.redirect(`/game/${gameId}`))
  .catch( (error) => console.log(error));
});

router.get("/:id", (request, response, next) => {
  const { username, id: userId } = request.user;
  const { id: gameId } = request.params;

  Promise.all([db.games.getGame(gameId),
              db.players.getDevCards(userId,gameId),
              db.players.getResources(userId,gameId)])
  .then(([gameInfo, playerDevCard,playerResources]) => {
    console.log(Object.assign({}, gameInfo, {playerDevCard},{playerResources}));
    response.render("game", Object.assign({}, gameInfo, {playerDevCard},{playerResources}, { username, userId }));
  }).catch(error => console.log(error));
});

router.post("/:id/vertex", gameReady, (request, response, next) => {
  console.log(request.body);
  response.sendStatus(200);
});

router.post("/:id/road", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/building", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/dice", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/buy-devcard", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/play-devcard", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade-offer", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade-reply", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/move-robber", gameReady, (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/endturn", gameReady, (request,response,next) => {
  const { id: userId} = request.user;
  const {id: gameId} = request.params;
  gameLogic.turn.isUserTurn(userId,gameId)
  .then( userTurn => {
        if(userTurn){
          return gameLogic.turn.updatePlayerTurn(gameId)
        }
        return [];
  })
  .then( () => {
    //TODO add socket event
    response.sendStatus(200);
  })
  .catch( (error) => {
    console.log(error);
    response.sendStatus(401);
  })

});

module.exports = router;
