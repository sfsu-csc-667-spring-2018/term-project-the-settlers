var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

router.post('/', function(request, response, next){
  const username = request.body['username'];
  const email = request.body['e-mail'];
  const password = request.body['password'];
  db.users.createUser(username,email,password, username+email)
    .then( (successMsg) =>  {
                              response.json(successMsg);
                            }

    ).catch( (rejectMsg) => {
                              response.json(rejectMsg);
                            }
    )
})

module.exports = router;
