module.exports = function(socket) {
    var steamSearch = require('steam-search');

    socket.on('gameNameUpdate', function(name) {
        steamSearch.getFirstGameInfo(name, function(result) {
            if (result) {
                socket.emit('gameNameResult', result);
            }
        });
    });

}
