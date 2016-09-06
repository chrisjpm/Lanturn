module.exports = function(socket) {
    var notificationQuery = require('../../queries/getNotifications');

    socket.on('getNotifications', function() {
        var username = (JSON.stringify(socket.handshake.session.passport) != '{}') ? socket.handshake.session.passport.user.username_lower : false;

        if(username !=false){
          notificationQuery.getNotifications(username, false,function(error, notifications){

            if(!error){
              socket.emit('getNotificationsResult', notifications);
            }
          });
        }
    });

}
