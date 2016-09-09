var mongoose = require("mongoose");


var PartyTicketSchema = new mongoose.Schema({
  owner_username_lower: {
    type: String
  },
  party_id: String,
  request_username_lower: String,
  request_username: String,
  request_userimage: String,  //TODO UPDATE REFERENCES TO PARTY TICKET SINCE STRUCTURE HAS BEEN MODIFIED
  request_date: { type: Date, default: Date.now },
  accepted: { type: Boolean, default: false }
}, {collection:'party_tickets'});


module.exports = PartyTicketSchema;
