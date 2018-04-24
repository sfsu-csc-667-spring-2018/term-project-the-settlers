if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

var express = require('express');
const passport = require('passport');
const session = require('express-session');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var tests = require('./routes/tests');
var register = require('./routes/register');
const lobby = require('./routes/lobby');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//for passport, username and password authentication
app.use(session({ secret: "catan",
                  resave: "true",
                  saveUninitialized: "true",
                  cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) }}
                  ));
app.use(passport.initialize());
app.use(passport.session());


//Define routes
app.use('/', index);
app.use('/users', users);
app.use('/tests', tests);
app.use('/register', register);
app.use('/lobby', lobby);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
