var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./app/routes');

var app = express();

/* REQUIREMENTS */

var db = require('./db');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var sessionData = require('./session');
var sessionStore = new MySQLStore(sessionData.options);
var emailer = require('./email');
var passport = require('passport');
var secrets = require('./secrets');
var FacebookStrategy = require('passport-facebook').Strategy;
var user = require('./app/models/user');

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');


/* DATABASE */

db.connect( function (err) {
    if(err){
        console.log('Unable to connect to MySQL');
        process.exit(1);
    }else{
        console.log('Successful connection to MySQL');
    }
});

/* SESSIONS */

app.use(
    session({
        secret: 'WjhwAYiMnXoO8Lw',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy'
    })
);

/* EMAILER */
emailer.connect();

emailer.get().verify(function (error, success) {
    if(error){
        console.log(error);
        process.exit(1);
    }
    else{
        console.log('Email connection active.');
    }
});

/* FACEBOOK */
passport.use(new FacebookStrategy( {
        clientID: secrets.fbAuth.clientID,
        clientSecret: secrets.fbAuth.clientSecret,
        //callbackURL: "https://localhost/facebook/callback",
        //callbackURL: "https://chirper.franspaco.com/facebook/callback",
        callbackURL: "https://192.168.0.152/facebook/callback",
        profileFields: ['id', 'displayName', 'emails'],
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
        if(profile){
            console.log(profile);
            let fbProfile = {
                name: profile.displayName,
                email: profile.emails[0].value,
                id: profile.id
            };
            console.log(fbProfile.email);
            user.User.findOrCreateFB(fbProfile,
                function (err, userResult) {
                    if(err){
                        console.log('Failed to register fb user');
                        console.log(err);
                        cb();
                    }
                    else{

                        if(userResult.type === 'created'){
                            console.log('FB USER CREATED');
                            req.session.idUser = userResult.user.insertId;
                            req.session.username = fbProfile.name;
                            req.session.userScore = user.defScore;
                        }
                        else if(userResult.type === 'found'){
                            console.log('FB USER FOUND');
                            req.session.idUser = userResult.user.idUser;
                            req.session.username = userResult.user.username;
                            req.session.userScore = userResult.user.score;
                        }
                        //console.log(req.session);
                        cb();
                    }
                });
        }else{
            console.log('wat??');
            cb();
        }
    }
));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
