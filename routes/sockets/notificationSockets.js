module.exports = function(socket) {
    var notificationQuery = require('../../queries/getNotifications');

    socket.on('getNotifications', function() {
        var username = (socket.handshake.session.passport) ? socket.handshake.session.passport.user.username_lower : false;

        if(username !=false){
          notificationQuery.getNotifications(username, false,function(error, notifications){

            if(!error){
              console.log("GOOFED"+ notifications);
              socket.emit('getNotificationsResult', notifications);
            }
          });
        }
    });

}
