var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://LanPlan.Cj1mckay%40gmail.com:Rarepepes123@smtp.gmail.com');

//Password hashing
var bcrypt = require('bcryptjs');
const saltRounds = 12;


//GET REQUESTS
router.get('/', function(req, res, next) {
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
            sendVerificationEmail(newUser.email);
            res.render("signup", {error: "Success"});
          }
        });
      });
    }else{
      return res.render("signup", {error: "Username/Email is already in use!"});
    }
  });

});

function sendVerificationEmail(email){
  var VerifierSchema = require('../models/verifier');
  var VerifierModel = db.model('verifier', VerifierSchema);

  var urlSafeEmail = email.replace("+","%2B");

  var token = Math.random().toString(36).substring(7);
  var url = "https://lanplan.herokuapp.com/verify_email?email="+urlSafeEmail+"&token="+token;

  var mailOptions = {
    from: '"Christopher@LanPlan 👥" <LanPlan.Cj1mckay@gmail.com>',
    to: email,
    subject: 'LanPlan Email Verification', // Subject line
    text: 'Welcome to LanPlan, please verify your email to complete your signup by click the following link: ' +url,
    html: '<p>Welcome to <b>LanPlan</b>, please verify your email to complete your signup by click the following link:</p> <a href="'+url+'">'+url+'</a>'
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log("failed to send" + error);
          return sendVerificationEmail(email);
      }
      console.log('Message sent: ' + info.response);

      var newVerifier = new VerifierModel();
      newVerifier.email = email;
      newVerifier.token = token;

      newVerifier.save(function(err){
        if(err){
          console.log("failed to save" + err);
          return sendVerificationEmail(email);
        }else{
          console.log("Success!");
        }
      });

  });
}

module.exports = router;
