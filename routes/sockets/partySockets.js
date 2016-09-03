module.exports = function(socket) {
    var ticketQuery = require('../../queries/getTickets');

    socket.on('joinParty', function(data) {
        var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;
        var partyID = (data.partyID) ? data.partyID : false;
        var ownerUsernameLower = (data.ownerUsernameLower) ? data.ownerUsernameLower : false;

        if(username !=false & partyID !=false & ownerUsernameLower !=false){
          ticketQuery.createTicket(username, ownerUsernameLower, partyID, function(error){
            if(error){
              socket.emit('joinPartyResult',error);
            }else{
              socket.emit('joinPartyResult', "Success");
            }
          });
        }
    });

}
