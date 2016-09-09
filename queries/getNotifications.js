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

exports.createPartyRequestDeclinedNotification = function(owner, username){
  createNotification(username, 1, "Party join request declined", owner+" declined your request to join their party.", "");
}

exports.createPartyRequestAcceptedNotification = function(owner, username){
  createNotification(username, 1, "Party join request accepted", owner+" accepted your request to join their party.", "");
}

exports.createPartyJoinRequestNotification = function(ownerUsernameLower,requestUsername,ticketID){
  var NotificationSchema = require('../models/notification');
  var NotificationModel = db.model('notification', NotificationSchema);

  var newNotification = new NotificationModel();

  newNotification.owner_username_lower = ownerUsernameLower;
  newNotification.not_type = 0;
  newNotification.not_title = "Party join request!";
  newNotification.not_desc = requestUsername+" has requested to join your party. Click to view their profile.";
  newNotification.not_target = '/user/'+requestUsername;
  newNotification.ticket_id = ticketID;

  newNotification.save();
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

exports.dismissNotification = function(username, id){
  var NotificationSchema = require('../models/notification');
  var NotificationModel = db.model('notification', NotificationSchema);

  var query = NotificationModel.findOne({
      _id: id,
      owner_username_lower: username
    }).exec(function(err, notification){
      notification.dismissed = true;
      notification.save();
    });
}
