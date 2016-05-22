var express = require('express');
var router = express.Router();

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

require('./authentication/pass.js')(passport, LocalStrategy);


//GET REQUESTS
router.get('/', function(req, res) {
    res.render('login.ejs', {error : req.flash("error")});
});


//POST REQUESTS
router.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));


module.exports = router;
