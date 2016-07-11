var mongoose = require("mongoose");


var UserSchema = new mongoose.Schema({
  name: String, //NAME OF LAN PARTY
  owner_username: {
    type: String
  },
  owner_username_lower: {
    type: String
  },
  game_info: Object, //CONTAINS GAME INFO (USUALLY TAKEN FROM STEAM)
  attendants: Array, //ARRAY OF ATTENDEES (USE LENGTH FOR NO OF ATTENDEES)
  maxAttendants: Number,
  addressLine1: String, //ADDRESS STUFF
  addressLine2: String,
  addressCity: String,
  addressZip: String,
  addressCountry: String,
  coords: {         // ACCURATE COORDS FOR ATTENDEES
    type: [Number], // [<longitude>, <latitude>]
    index: '2d'
  },
  randCoords: {    //RANDOM OFFSET FOR USER SAFETY
    type: [Number], // [<longitude>, <latitude>]
    index: '2d'
  },
  type: String,  // E.G CASUAL/COMPETITIVE
  prize: String, // ONLY APPLICABLE FOR COMPETITIVE
  date: String,  // DATE/TIME OF LAN PARTY
  descriptionHeader1: String, //DESCRIPTION STUFF
  descriptionHeader2: String,
  descriptionHeader3: String,
  descriptionSub1: String,
  descriptionSub2: String,
  descriptionSub3: String,
  image: String
}, {collection:'parties'});


module.exports = UserSchema;
