const express = require("express");
const router = express.Router();
const authenticate = require("../authentication/authenticated");
const db = require("../db");

router.use(authenticate);

/* GET home page. */
router.get("/", function(req, res, next) {
  console.log("from game", req.user);
  res.render("game", { title: "Express", user: req.user.username });
});

router.post("/", function(req, res, next) {
  db.games
    .createGame()
    .then(({ id }) => {
      res.redirect(`/game/${id}`);
    })
    .catch(error => console.log(error));
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
