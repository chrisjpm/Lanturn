module.exports = function(server){
    var io = require("socket.io").listen(server);
    var steamSearch = require('steam-search');
    console.log("die");
    io.on('connection', function (socket) {
      console.log("hi there");
      socket.on('gameNameUpdate', function (name) {
        steamSearch.getFirstGameInfo(name, function(result){
          if(result){
            socket.emit('gameNameResult', result);
          }
        });
      });
    });

    return io;
};
