module.exports = function(server, cookieParser, passport,session, secret) {
    var io = require("socket.io").listen(server);
    var passportSocketIo = require('passport.socketio');

    io.use(passportSocketIo.authorize({
      key: 'connect.sid',
      secret: secret,
      store: session,
      passport: passport,
      cookieParser: cookieParser
    }));

    io.on('connection', function(socket) {
        require("./gameSearchSockets")(socket);
        require("./mapSockets")(socket);
    });

    return io;
};
