var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('user.jade', { title : 'User', user : user });
});

module.exports = router;
