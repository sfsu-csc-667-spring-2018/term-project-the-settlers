var express = require('express');
var router = express.Router();
const authenticate = require('../authentication/authenticated');

router.use(authenticate);

/* GET home page. */
router.get('/', function(request, response, next) {
    console.log('from lobby', request.user);
    response.render('lobby', {title: 'Express', user: request.user.username});
});

module.exports = router;
