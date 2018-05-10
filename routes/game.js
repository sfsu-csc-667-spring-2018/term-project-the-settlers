const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/authenticated");
const db = require("../db");

addPlayer = (userId,gameId) => {
  return db.games.getPlayerCount(gameId)
      .then( (players) => {
        const {player_count: count, player_limit} = players;
        console.log(count + ' ' + player_limit);
        if(count < player_limit){
          return db.games.addPlayer(gameId,userId,parseInt(count)+1)
        }
      })
};

router.use(authenticate);

router.post("/", function(req, res, next) {
  db.games
    .createGame()
    .then(({ id }) => {
      res.redirect(`/game/${id}`);
    })
    .catch(error => console.log(error));
});

router.post("/join/:id",(request,response,next) => {
  const {id: userId} = request.user;
  const {id: gameId} = request.params;
  addPlayer(userId,gameId)
  .then( () =>
    response.redirect("/game/" + gameId)
  ).catch( error => console.log(error));
});

router.get("/:id", (request, response, next) => {
  const { username, id: userId } = request.user;
  const { id: gameId } = request.params;

  db.games
    .getGame(gameId)
    .then(result =>
      response.render("game", Object.assign({}, result, { username, userId }))
    )
    .catch(error => console.log(error));
});

router.post("/:id/vertex", (request, response, next) => {
  console.log(request.body);
  response.sendStatus(200);
});

module.exports = router;
