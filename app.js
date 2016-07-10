var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('hbs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var https = require('https');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

require('./routes/authentication/pass.js')(passport, LocalStrategy);

var httpsPort = 443;
var httpsOptions = {
  key: fs.readFileSync('certs/lanturn.key'),
  cert: fs.readFileSync('certs/www.lanturn.net.pem')
};

var app = express();
var server = require('http').createServer(app);
var secureServer = https.createServer(httpsOptions, app);

var io = require("./routes/sockets/sockets")(server);

var routes = require('./routes/routes.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use(session({ secret: 'dankmemeskhalifakappaAappa' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(userView);

app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}else{
  app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://www.lanturn.net'+req.url)
  else
    next() /* Continue to other routes if we're not redirecting */
})
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function userView(req, res, next) {
    res.locals.user = req.user;
    next();
}

server.listen(process.env.PORT || 80);
secureServer.listen(httpsPort);

module.exports = app;
