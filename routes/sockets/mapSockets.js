module.exports = function(socket){
  var partyQuery = require('../../queries/getParties');

  socket.on('scanParties', function(coords) {
      partyQuery.getPartiesInSetRadius(coords, function(err, partyList) {
          if (!err && partyList) {
              socket.emit('partyScanResult', partyList);
              console.log(partyList);
          }
      });
  });

  socket.on('getParty', function(partyID) {
    partyQuery.getPartyInfo(partyID, function(err, partyInfo){
      if(!err && partyInfo){
        socket.emit('getPartyResult',partyInfo);
      }
    });
  });
}
