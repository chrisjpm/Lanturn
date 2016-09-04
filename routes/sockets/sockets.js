module.exports = function(server,ios,session) {
    var io = require("socket.io").listen(server);

    io.use(ios(session));

    io.on('connection', function(socket) {
        //console.log("THAT MEANS USERNAME :" +socket.handshake.session.passport.user.username);
        require("./gameSearchSockets")(socket);
        require("./mapSockets")(socket);
        require("./partySockets")(socket);
    });

    return io;
};
