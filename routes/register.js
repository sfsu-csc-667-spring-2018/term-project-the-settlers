var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/', function(request, response, next){
  const username = request.body['username'];
  const email = request.body['email'];
  const password = request.body['password'];
  db.users.createUser(username,email,password, username+email)
    .then( (successMsg) =>  {
                              response.redirect("./");
                              console.log(successMsg);
                            }

    ).catch( (rejectMsg) => { 
                              response.redirect("./register");
                              console.log(rejectMsg);
                            }
    )
})

module.exports = router;
