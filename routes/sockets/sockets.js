module.exports = function(server) {
    var io = require("socket.io").listen(server);

    io.on('connection', function(socket) {
        require("./gameSearchSockets")(socket);
        require("./mapSockets")(socket);
    });

    return io;
};
