var express = require('express')
  , router = express.Router();

router.use('/', require('./home'));
router.use('/users', require('./users'));
router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/logout', require('./logout'));
router.use('/create', require('./create'));
router.use('/verify_email', require('./verify_email'));
router.use('/gitwebhook', require('./gitwebhook'));
router.use('/blog', require('./blog'));
router.use('/login', require('./login'));

module.exports = router;
