var express = require('express');
var router = express.Router();

//GET REQUESTS
router.get('/', function(req, res) {
  req.logout();
  res.redirect('./');
});

module.exports = router;
