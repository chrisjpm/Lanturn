var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');
var notificationQuery = require('../queries/getNotifications');
var partyQuery = require('../queries/getParties');

exports.createTicket = function(usernameLower,username,userImage, ownerUsernameLower, partyID, callback){
  var TicketSchema = require('../models/party_ticket');
  var TicketModel = db.model('ticket', TicketSchema);

  if(usernameLower == ownerUsernameLower){
    return callback("Nice try, you can't join your own party");
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
      newTicket.request_username = username;
      newTicket.request_userimage = userImage;

      newTicket.save(function(err, ticket){
        if(err){
            callback("Unable to submit ticket, please try again later.");
          }else{
            notificationQuery.createPartyJoinRequestNotification(ownerUsernameLower,username,ticket._id)
            callback(false);
          }
      });
    }
  });

}

exports.acceptTicket = function(ownerUsernameLower, ticketID, callback){
  var TicketSchema = require('../models/party_ticket');
  var TicketModel = db.model('ticket', TicketSchema);

  var query = TicketModel.findOne({
    _id: ticketID,
    owner_username_lower: ownerUsernameLower,
    accepted: false
  }).exec(function(err, ticket){
    if(ticket){
      partyQuery.isPartyFull(ticket.party_id, function(err,isFull){
        if(!err & !isFull){
          ticket.accepted = true;

          var playerObj = {"username":ticket.request_username, "username_lower":ticket.request_username_lower,"image":ticket.request_userimage};
          partyQuery.addPlayerToParty(ticket.party_id, playerObj);

          ticket.save();

          callback(false, playerObj.username_lower);
        }
      });
    }else{
      callback("Invalid ticket.", null);
    }
  });
}

exports.declineTicket = function(ownerUsernameLower, ticketID, callback){
  var TicketSchema = require('../models/party_ticket');
  var TicketModel = db.model('ticket', TicketSchema);

  var query = TicketModel.findOne({
    _id: ticketID,
    owner_username_lower: ownerUsernameLower,
    accepted: false
  }).exec(function(err, ticket){
    if(ticket){
      var reqUser = ticket.request_username_lower;

      TicketModel.remove({_id:ticketID}, function(err){
          if(err){
            callback("Could not remove ticket.", null);
          }

          callback(false, reqUser);
      })
    }else{
      callback("Invalid ticket.", null);
    }
  });
}
