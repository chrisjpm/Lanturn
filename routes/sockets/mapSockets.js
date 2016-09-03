module.exports = function(socket){
  var partyQuery = require('../../queries/getParties');

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
    var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;
    console.log("USERNAME: " + username);
    partyQuery.getPartyInfo(partyID, function(err, partyInfo, username){
      if(!err && partyInfo){
        //console.log(partyInfo);
        socket.emit('getPartyResult',partyInfo);
      }
    });
  });
}
