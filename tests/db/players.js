require('dotenv').config();
const db = require('../../db');

db.players.addDevCard(7,3,'KNIGHT')
.catch(error => console.log('addDevCard' + error));

db.players.findPlayerId(1)
.then(data => console.log('findPlayerId test' + data.id))
.catch(error => console.log('findPlayerId' + error));

db.players.findPlayerGame(1)
.then(data => console.log('findPlayerGame' + data.game_id))
.catch(error => console.log('findPlayerGame' + error));

db.players.addResource(3,7,'brick',5)
.then(data => console.log('addResource' + data))
.catch(error => console.log('addResource ERROR' + error));
