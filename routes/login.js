var express = require('express');
var router = express.Router();

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

require('./authentication/pass.js')(passport, LocalStrategy);


//GET REQUESTS
router.get('/', function(req, res) {
    res.render('login.hbs', {error : req.flash("error"), pagename: 'Login'});
});


//POST REQUESTS
router.post('/', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));


module.exports = router;
