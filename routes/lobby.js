var express = require('express');
var router = express.Router();
const authenticate = require('../authentication/authenticated');
const chat = require('../chat');
const io = require('../socket.io')(server);


router.use(authenticate);

var user;

/* GET home page. */
router.get('/', function(request, response, next) {
            console.log(request.user);
            user = request.user;
            response.render('lobby', {title: 'Express'});
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
        io.emit('chat send', msg, user);
        // io.emit('chat send', {msg: message, user: user});
    });
});

module.exports = router;
