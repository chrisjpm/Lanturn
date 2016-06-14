var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

//Password hashing
var bcrypt = require('bcrypt');
const saltRounds = 12;


//GET REQUESTS
router.get('/', function(req, res, next) {
  var partyQuery = require('../queries/getParties');
  partyQuery.getPartiesInSetRadius({"lat":55.8237866, "lng" : -4.2750094000000445}, function(err, partyList){
    console.log("party list: " +partyList);
    console.log("ERORR: " +err);
    if(!err && partyList){
      console.log(partyList);
    }
  });
  res.render('signup.ejs',{error : req.flash("error")});
});


//POST REQUESTS
router.post('/', function(req, res) {
  var UserSchema = require('../models/user');
  var UserModel = db.model('user', UserSchema);

  var username = req.body.usr;
  var password = req.body.psw;
  var email = req.body.email;
  var name = req.body.name;
  var location = req.body.loc;

  UserModel.find( { $or:[ {'username_lower':username.toLowerCase()}, {'email':email.toLowerCase()} ]},function(err,docs){
    if(err){
      return res.render("signup", {error: "Internal error, please try again later."});
    }

    if(docs.length == 0){
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
          return res.render("signup", {error: "Internal error, please try again later."});
        }
        var newUser = new UserModel();
        newUser.username = username;
        newUser.username_lower = username.toLowerCase();
        newUser.pass_hash = hash;
        newUser.full_name = name;
        newUser.email = email.toLowerCase();
        newUser.location = location;

        newUser.save(function(err){
          if(err){
            return res.render("signup", {error: "Internal error, please try again later."});
          }else{
            res.render("signup", {error: "Success"});
          }
        });
      });
    }else{
      return res.render("signup", {error: "Username/Email is already in use!"});
    }
  });

});

module.exports = router;
