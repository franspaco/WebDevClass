var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var indexRoutes = require('./app_server/routes/index');
var gasolineriasRoutes = require('./app_server/routes/gasolineras');
var db = require('./db');
//var routes = require('./app_server/routes/index');
//var users = require('./app_server/routes/users');

var app = express();

app.use(function(req, res, next) {
  console.log("Welcome to my Gas app!!!");
  next();
});


db.connect( function (err) {
    if(err){
        console.log('Unable to connect to MySQL');
        process.exit(1);
    }else{
        console.log('Successful connection to MySQL');
    }
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRoutes);
app.use('/gasolineras', gasolineriasRoutes);

//app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err);
  fs.readFile("./public/404.html", function(err, data){
	  res.writeHead(404, {'Content-Type': 'text/html'});
	  res.write(data);
	  res.end();
	});
});

// error handlers
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.log(err.message);
  	fs.readFile("./public/500.html", function(err, data){
	  res.writeHead(500, {'Content-Type': 'text/html'});
	  res.write(data);
	  res.end();
	});
});


module.exports = app;
