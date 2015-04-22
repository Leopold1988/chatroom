var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function (req, res) {
  var user = {
    first_name : 'Barak',
    surname : 'Obama',
    address : 'The White House'
  };

  var uajson = require('../module/ua.js')(req.headers["user-agent"]);

  if (Number(uajson.VERSION) < 9 && uajson.IE) {
    res.send("由于使用websocket和css3故暂不支持IE浏览器，如使用双核浏览器请切换至webkit内核。");
  } else {
    res.render('index.jade', { title : 'User', user : user });
  }
});

module.exports = router;