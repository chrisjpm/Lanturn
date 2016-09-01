module.exports = function(server,cookie,connect,secret, sessionStore) {
    var io = require("socket.io").listen(server);

    io.set('authorization', function(data, cb) {
        if (data.headers.cookie) {
          var sessionCookie = cookie.parse(data.headers.cookie);
          var sessionID = connect.utils.parseSignedCookie(sessionCookie['connect.sid'], secret);
          sessionStore.get(sessionID, function(err, session) {
            console.log("sessuin: " session)
            if (err || !session) {
              cb('Error', false);
            } else {
              data.session = session;
              data.sessionID = sessionID;
              cb(null, true);
            }
          });
        } else {
          cb('No cookie', false);
        }
    });

    io.on('connection', function(socket) {
        require("./gameSearchSockets")(socket);
        require("./mapSockets")(socket);
    });

    return io;
};
