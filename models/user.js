var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  username_lower: {
    type: String
  },
  email: String,
  pass_hash: String,
  full_name: String,
  location: String,
  account_type: { type: String, default: "noob" },
  image_name: { type: String, default: "default.png" },
  friendly_rep: { type: Number, default: 0 },
  host_rep: { type: Number, default: 0 },
  mvps: { type: Number, default: 0 },
  join_date: { type: Date, default: Date.now },
}, {collection:'users'});


module.exports = UserSchema;
