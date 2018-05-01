var express = require('express');
var router = express.Router();
const authenticate = require('../authentication/authenticated');

router.use(authenticate);

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('from game', req.user);
    res.render('game', { title: 'Express', user: req.user.username });
});

module.exports = router;