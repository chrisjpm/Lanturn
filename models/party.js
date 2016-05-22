var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
  owner_username: {
    type: String
  },
  game_info: Array,
  attendants: Array,
  maxAttendants: Integer,
  address: String,
  coords: Array,
  date: Date,
  description: String
}, {collection:'users'});


module.exports = UserSchema;
