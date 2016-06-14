var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

var geocode = require('google-geocode');
var timezone = require('google-timezone-api');

geocode.setApiKey('AIzaSyDwjIwO0OMMePelLG1v27PjXEQn5NfdvW4');

router.get('/',isLoggedIn, function(req, res, next) {
  res.render('create.ejs');
});

router.get('/party',isLoggedIn, function(req, res, next) {
  res.render('create_party.ejs', {error : req.flash("party_submit_res")});
});


router.post('/party',isLoggedIn, function(req, res, next) {
  var PartySchema = require('../models/party');
  var PartyModel = db.model('party', PartySchema);

  console.log(req.user);

  var username = req.user.username;
  var gameName = req.body.game_name;
  var gameUrl = req.body.game_url;
  var gameImage = req.body.game_image;
  var gamePrice = req.body.game_price;
  var gameRating = req.body.gameRating;

  var maxPlayers = req.body.max_attendants;
  var address = req.body.address;
  var description = req.body.desc;
  var date = req.body.date;

  date = convertTo24Hr(date);

  var gameInfo = {"name" : gameName,
                  "url" : gameUrl,
                  "image" : gameImage,
                  "price" : gamePrice,
                  "rating" : gameRating};

  geocode.getGeocode(address, function(data) {
    if(JSON.parse(data).results.length == 0){
      req.flash('party_submit_res', 'Invalid address');
      res.redirect('/create/party');
    }else{
      var results = JSON.parse(data).results[0];
      var coords = [results.geometry.location.lng, results.geometry.location.lat];

      address = results.formatted_address;

      //ADD TO DB
      var newParty = new PartyModel();
      newParty.owner_username = username;
      newParty.owner_username_lower = username.toLowerCase();
      newParty.game_info = gameInfo;
      newParty.attendants = [];
      newParty.maxAttendants = maxPlayers;
      newParty.address = address;
      newParty.coords = coords;
      newParty.date = date;
      newParty.description = description;

      newParty.save(function(err){
        if(err){
          req.flash('party_submit_res', 'Unable to save to db');
          res.redirect('/create/party');
        }else{
          req.flash('party_submit_res', 'Success');
          res.redirect('/create/party');
        }
      });
    }
  }, function(err) {
    req.flash('party_submit_res', 'Invalid address');
    res.redirect('/create/party');
  });
});


function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

function convertTo24Hr(date){
  var dateArr = date.split(" ");
  var newDate;

  if(dateArr[2] == "PM"){
    var newHour = parseInt(dateArr[1].split(":")[0]) + 12;
    var minute = dateArr[1].split(":")[1];
    newDate = dateArr[0] + "-" + newHour + ":" + minute;
  }else{
    newDate = dateArr[0] + "-0" + dateArr[1];
  }

  return newDate;
}

module.exports = router;
