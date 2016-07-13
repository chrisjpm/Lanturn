var express = require('express');
var router = express.Router();

var execFile = require('child_process').execFile;

router.get('/', function(req, res, next) {
  execFile('./webhook.sh', function(error, stdout, stderr){
	   res.send("Ok" + stdout);
  });

});

module.exports = router;
