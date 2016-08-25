var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('blog.hbs', {pagename: 'Blog', layout: 'layout-blog'});
});

module.exports = router;
