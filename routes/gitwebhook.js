var express = require('express');
var router = express.Router();

var execFile = require('child_process').execFile;

router.get('/', function(req, res, next) {
  execFile('./webhook.sh', function(error, stdout, stderr){
	   //res.send("Ok" + stdout);
     console.log("err"+ error);
     console.log("ok"+ stdout);
     console.log("stderr"+ stderr);
  });
  console.log("ok");

});

module.exports = router;
