var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

function createNotification(usernameLower,type,title,description,target){
  var NotificationSchema = require('../models/notification');
  var NotificationModel = db.model('notification', NotificationSchema);

  var newNotification = new NotificationModel();

  newNotification.owner_username_lower = usernameLower;
  newNotification.not_type = type;
  newNotification.not_title = title;
  newNotification.not_desc = description;
  newNotification.not_target = target;

  newNotification.save();
}

exports.createNotification = createNotification;

exports.createPartyJoinRequestNotification = function(ownerUsernameLower,requestUsername,ticketID){
  createNotification(ownerUsernameLower, 0, "Party join request!", requestUsername+" has requested to join your party. Click to respond.", "/partyticket/"+ticketID);
}

exports.getNotifications = function(usernameLower,isRead,callback){
  var NotificationSchema = require('../models/notification');
  var NotificationModel = db.model('notification', NotificationSchema);

  var query = NotificationModel.find({
      owner_username_lower: usernameLower,
      dismissed:isRead
    }).exec(function(err, notifications){
      return callback(err, notifications);
    });
}
