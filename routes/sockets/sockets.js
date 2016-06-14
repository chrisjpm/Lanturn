module.exports = function(server){
    var io = require("socket.io").listen(server);
    var steamSearch = require('steam-search');
    var partyQuery = require('../../queries/getParties');

    io.on('connection', function (socket) {
      socket.on('gameNameUpdate', function (name) {
        steamSearch.getFirstGameInfo(name, function(result){
          if(result){
            socket.emit('gameNameResult', result);
          }
        });
      });

      socket.on('scanParties', function (coords) {
        partyQuery.getPartiesInSetRadius(coords, function(err, partyList){
          if(!err && partyList){
            socket.emit('partyScanResult', partyList);
            console.log(partyList);
          }
        });
      });
    });

    return io;
};
