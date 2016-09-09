module.exports = function(socket) {
    var ticketQuery = require('../../queries/getTickets');
    var notificationQuery = require('../../queries/getNotifications');
    var partyQuery = require('../../queries/getParties')

    socket.on('joinParty', function(data) {
        var usernameLower = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;
        var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username : false;
        var userImage = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.image_name : false;

        var partyID = (data.partyID) ? data.partyID : false;

        if(usernameLower !=false & partyID !=false){
          partyQuery.getPartyOwner(partyID, true, function(error,ownerUsernameLower){
            if(!error){
              ticketQuery.createTicket(usernameLower,username,userImage, ownerUsernameLower, partyID, function(error){
                if(error){
                  console.log(error);
                  socket.emit('joinPartyResult',error);
                }else{
                  socket.emit('joinPartyResult', "Success");
                }
              });
            }
          });
        }
    });

    socket.on('acceptPartyRequest', function(data){
      var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;
      var ticketID = (data.ticket) ? data.ticket : false;
      var notID = (data.notification) ? data.notification : false;
      console.log("LETS GO!");
      console.log(username != false);
      console.log(ticketID);
      if(username != false && ticketID != false && notID != false){
        ticketQuery.acceptTicket(username, ticketID, function(error){
          console.log("ACCEPT TICKET ERROR:"+error);
          if(error){
            socket.emit('acceptPartyRequestResult', error);
          }else{
            notificationQuery.dismissNotification(username, notID);
            socket.emit('acceptPartyRequestResult', "Success");
          }
        });
      }
    });

    socket.on('declinePartyRequest', function(data){
      var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;
      var ticketID = (data.ticket) ? data.ticket : false;
      var notID = (data.notification) ? data.notification : false;
      console.log("LETS GO!");
      console.log(username != false);
      console.log(ticketID);
      if(username != false && ticketID != false && notID != false){
        ticketQuery.declineTicket(username, ticketID, function(error, reqUser){
          console.log("DECLINE TICKET ERROR:"+error);
          if(error){
            socket.emit('declinePartyRequestResult', error);
          }else{
            notificationQuery.dismissNotification(username, notID);
            notificationQuery.createPartyRequestDeclinedNotification(username, reqUser)
            socket.emit('declinePartyRequestResult', "Success");
          }
        });
      }
    });
}
