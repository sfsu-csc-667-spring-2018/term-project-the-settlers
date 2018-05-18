const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/authenticated");
const db = require("../db");

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

router.post("/:id/vertex", (request, response, next) => {
  console.log(request.body);
  response.sendStatus(200);
});

router.post("/:id/road", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/building", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/dice", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/buy-devcard", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/play-devcard", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade-offer", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade-reply", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/trade", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/move-robber", (request,response,next) => {
  response.sendStatus(200);
});

router.post("/:id/endturn", (request,response,next) => {
  response.sendStatus(200);
});

module.exports = router;
