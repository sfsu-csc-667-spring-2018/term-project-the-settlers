var express = require('express');
var router = express.Router();
const authenticate = require('../authentication/authenticated');
const db = require('../db');

router.use(authenticate);

router.get('/', function(request, response, next) {
    db.games.getGames()
    .then ( gameList =>
              {
                const games  = {};
                gameList.forEach( (game) =>
                                {
                                  games[game.id] = game;
                });
                response.render('lobby',
                                {title: 'Express', user: request.user.username, games:games});
    })
    .catch( error => console.log(error));
});

module.exports = router;
