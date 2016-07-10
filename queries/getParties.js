var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

const SET_RADIUS = 1000;

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
  }, {address:0}).exec(function(err, parties){
    return callback(err, parties);
  });
}

exports.getPartyInfo = function(id, callback){
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  var query = PartyModel.findOne({
    _id: id
  }, {address:0}).exec(function(err, party){
    return callback(err, party);
  });
}
