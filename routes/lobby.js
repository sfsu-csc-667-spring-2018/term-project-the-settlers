var express = require('express');
var router = express.Router();
const passport = require('../authentication');



/* GET home page. */
router.get('/', function(request, response, next) {
                              console.log(request.user);
                              if(request.user){
                                response.render('lobby', {title: 'Express'});
                              }else{
                                response.redirect('/');
                              }
                            }
);

module.exports = router;
