const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db');


passport.use(new LocalStrategy(
            (username,password,done) => {
                db.users.checkUser(username,password)
                .then( user => done(null,user) )
                .catch( () => done(null,false));

            }
));

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(userid,done){
  db.users.findByUserId(userid)
   .then( user => {done(null,user);}).
    catch( error => {done(null,false);console.log(error)});

})

module.exports = passport;
