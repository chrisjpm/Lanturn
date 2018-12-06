var mongoose = require("mongoose");


var NotificationSchema = new mongoose.Schema({
  owner_username_lower: {
    type: String
  },
  not_type: Number,
  not_title: String,
  not_desc: String,
  not_target: String,
  not_date: { type: Date, default: Date.now },
  ticket_id: {type: String, default: ""}, //Only used for party join requests (not_type will be 0)
  dismissed: { type: Boolean, default: false }
}, {collection:'notifications'});


module.exports = NotificationSchema;
