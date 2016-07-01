var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://admin:nostromo23@ds011422.mlab.com:11422/lanplan');


//GET REQUESTS
router.get('/', function(req, res) {
  var email = req.query.email;
  var token = req.query.token;

  verifyEmail(email, token, function(err, verified){
    if(err){
      res.send(err);
    }else{
      if(verified == true){
        res.send("Email has been verified, you may now login.");
      }else{
        res.send("Email was not verified.");
      }
    }
  });
});

function verifyEmail(email, token, done){
  if(email && token){
    var VerifierSchema = require('../models/verifier');
    var VerifierModel = db.model('verifier', VerifierSchema);

    var UserSchema = require('../models/user');
    var UserModel = db.model('user', UserSchema);

    email = email.toLowerCase();
    console.log(email);
    VerifierModel.findOne({email: email}, function(err, verifier) {
      if (err) { return done("Failed while querying the database.", false);  }
      if (!verifier) {
        return done("Could not find email to verify in database.", false);
      }

      if(verifier.token == token){
        UserModel.findOneAndUpdate({ email: email }, { $set: { verified: true }}, function(err, doc){
          if (err){ return done("Failed while querying the database.", false);}
          return done(null, true);
        });
      }else{
        return done("Incorrect verification token.", false);
      }
    });
  }else{
    done("Failed due to missing params.", false);
  }
}

module.exports = router;
