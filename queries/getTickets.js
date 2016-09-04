var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');
var notificationQuery = require('../queries/getNotifications');

exports.createTicket = function(usernameLower, ownerUsernameLower, partyID, callback){
  var TicketSchema = require('../models/party_ticket');
  var TicketModel = db.model('ticket', TicketSchema);

  if(usernameLower == ownerUsernameLower){
    callback("Nice try, you can't join your own party");
  }

  var query = TicketModel.findOne({
    party_id: partyID,
    request_username_lower: usernameLower
  }).exec(function(err, ticket){
    if(ticket){
      callback("You have already requested to join this party.");
    }else{
      var newTicket = new TicketModel();
      newTicket.owner_username_lower = ownerUsernameLower;
      newTicket.party_id = partyID;
      newTicket.request_username_lower = usernameLower;

      newTicket.save(function(err, ticket){
        if(err){
            callback("Unable to submit ticket, please try again later.");
          }else{
            notificationQuery.createPartyJoinRequestNotification(ownerUsernameLower,usernameLower,ticket._id)
            callback(false);
          }
      });
    }
  });

}
