var express = require('express');
var router = express.Router();
const authenticate = require('../authentication/authenticated');
const db = require('../db');

router.use(authenticate);

/*
router.get('/', function(req, res, next) {
    console.log('from game', req.user);
    res.render('game', { title: 'Express', user: req.user.username });
}
*/

router.post('/',function(request,response,next){
  db.games.createGame()
  .then( game => {
                  response.status(302).send({game:game.id});
                  console.log(game.id);

        }
    )
  .catch(error => console.log('error creating game ' + error));
})

router.get('/:id',function(request,response,next){
  response.render('game', { title: 'Express', user: request.user.username, gameId: request.params.id });
})

module.exports = router;
