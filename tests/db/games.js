require('dotenv').config();
const db = require('../../db');
 //
 // db.games.createGame()
 // .then( data => console.log('createGame Test: ' + data.id))
 // .catch( error => console.log("createGame" + error));


db.games.getGames()
.then (data => {
                console.log('getGames Test: ');
                data.forEach( (game) => console.log(game.game_id))
      })
.catch( error => console.log("getGames" + error));

db.games.getPlayerCount(2).
then (data => console.log('getPlayerCount Test:' + data.count))
.catch(error => console.log('getPlayerCount' + error));

db.games.addPlayer(3,7,3,'Y')
.then(data => console.log('addPlayer Test' + data.id))
.catch(error => console.log('addPlayer' + error ));
