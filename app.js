var express = require('express');
var path = require('path');
var compression = require('compression')
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var hbs = require('hbs');
var constants = require('constants');
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var connect = require('connect');
var bodyParser = require('body-parser');
var Session = require('express-session');
var flash = require('connect-flash');
var https = require('https');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

const SECRET = 'dankmemeskhalifakappaAappa';

var RedisStore = require('connect-redis')(Session);

var sessionStore = new RedisStore({ // Create a session Store
    host: 'localhost',
    port: 6379,
});

var session = Session({ store: sessionStore, secret: SECRET, saveUninitialized: true, resave:false })

var ios = require('socket.io-express-session');


require('./routes/authentication/pass.js')(passport, LocalStrategy);

var httpsPort = 443;
var httpsOptions = {
    secureOptions: constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2,

    key: fs.readFileSync('./certs/myserver1.key'),
    cert: fs.readFileSync('./certs/lanturn_net.crt'),
    ca: [fs.readFileSync('./certs/ln1.crt'), fs.readFileSync('./certs/ln2.crt')]
    //requestCert: true,
    //rejectUnauthorized: false
};

var app = express();
var server;
if (app.get('env') !== 'development') {
  server = require("http").createServer(function(req, res){
       res.writeHead(301, {
         'Content-Type': 'text/plain',
         'Location':'https://'+req.headers.host+req.url });
       res.end('Redirecting to SSL\n');
    });
}else{
  server = require('http').createServer(app);
}
var secureServer = https.createServer(httpsOptions, app);

var routes = require('./routes/routes.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(SECRET));
app.use(compression());
app.use('/prox', require('iproxy'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/images/icons/favicon.ico'));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(userView);

app.use(routes);

var io = require("./routes/sockets/sockets")(secureServer, ios,session);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') !== 'development') {
   app.use(function(req, res, next) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000000");
    return next();
  });
}else{
  app.use(function(err, req, res, next) {
       res.status(err.status || 500);
       res.render('error', {
         message: err.message,
         error: err
       });
    });
}

// error handlers
// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }else{
//   app.get('*',function(req,res,next){
//   if(req.headers['x-forwarded-proto']!='https')
//     res.redirect('https://www.lanturn.net'+req.url)
//   else
//     next() /* Continue to other routes if we're not redirecting */
// })
// }

var ONE_YEAR = 31536000000;
app.use(helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubdomains: true,
    force: true
}));

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
