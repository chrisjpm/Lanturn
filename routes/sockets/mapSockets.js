module.exports = function(socket){
  var partyQuery = require('../../queries/getParties');
  console.log("Session: ", socket.handshake);
  socket.on('scanParties', function(coords) {
      console.log("HA GOTEM!");
      partyQuery.getPartiesInSetRadius(coords, function(err, partyList) {
          if (!err && partyList) {
              socket.emit('partyScanResult', partyList);
              //console.log(partyList);
          }
      });
  });

  socket.on('getParty', function(partyID) {
    partyQuery.getPartyInfo(partyID, function(err, partyInfo){
      if(!err && partyInfo){
        //console.log(partyInfo);
        socket.emit('getPartyResult',partyInfo);
      }
    });
  });
}
