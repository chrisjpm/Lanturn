var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

const SET_RADIUS = 1000;
const DEF_EXCLUSIONS = {addressLine1:0,addressLine2:0,addressCity:0,addressCountry:0, addressZip:0};

exports.getPartiesInRadius = function(radius, coords, callback){

}

exports.getPartiesInSetRadius = function(coords, callback){
  var maxDistance = SET_RADIUS / 6371;

  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  var coordArr = [coords.lng, coords.lat];

  var query = PartyModel.find({
    coords: {
      $near: coordArr,
      $maxDistance: maxDistance
    }
  }, {owner_username:0,owner_username_lower:0,game_info:0,addressLine1:0,addressLine2:0,addressCity:0,addressCountry:0,description:0}).exec(function(err, parties){
    return callback(err, parties);
  });
}

exports.getPartyInfo = function(id, callback, username){
  var PartySchema = require('../models/party');
  var TicketSchema = require('../models/party_ticket');
  var PartyModel = db.model('party', PartySchema);
  var TicketModel = db.model('party_ticket', TicketSchema);

  if(!username){
    return exports.getPartyInfo(id, callback);
  }

  var ticketQuery = TicketModel.findOne({
    party_id: id,
    request_username_lower: username,
    accepted: true
  }).exec(function(err, ticket){
    var exclusions = DEF_EXCLUSIONS;
    if(ticket){
      exclusions = {};
    }

    var partyQuery = PartyModel.findOne({
      _id: id
    }, exclusions).exec(function(err, party){
      return callback(err, party);
    });
  });
}

exports.getPartyInfo = function(id, callback){
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  var query = PartyModel.findOne({
    _id: id
  }, DEF_EXCLUSIONS).exec(function(err, party){
    return callback(err, party);
  });
}

exports.addPlayerToParty = function(id, player){
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  console.log("billy@?");
  var query = PartyModel.findOne({
    _id: id
  }, DEF_EXCLUSIONS).exec(function(err, party){
    party.attendants.push(player);
    party.save();
  });
}

exports.isPartyFull = function(id, callback){
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  var query = PartyModel.findOne({
    _id: id
  }, DEF_EXCLUSIONS).exec(function(err, party){
    var isFull = (party.attendants.length == party.maxAttendants);
    return callback(err, isFull);
  });
}

exports.getPartyOwner = function(partyID, isLowercase, callback){
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  var query = PartyModel.findOne({
    _id: partyID
  }, DEF_EXCLUSIONS).exec(function(err, party){
    var username;
    if(isLowercase){
      username = party.owner_username_lower;
    }else{
      username = party.owner_username;
    }
    return callback(err, username);
  });
}
