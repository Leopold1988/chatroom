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

  if (Number(uajson.VERSION) < 9 && uajson.IE && false) {
    res.send("由于使用websocket和css3故暂不支持IE浏览器，如使用双核浏览器请切换至webkit内核。");
  } else {
    var csp = "default-src 'self'; " +
              "script-src 'self'; " +
              "object-src 'none'; " +
              "img-src 'self'; " +
              "media-src 'none'; " +
              "frame-src 'none'; " +
              "font-src 'none'; " +
              "connect-src 'self';";

    // res.render('index.jade', { title : 'User', user : user });
    res.render('user.jade', { title : 'User', user : user });

    res.setHeader("Content-Security-Policy", csp);
    res.setHeader("X-Content-Security-Policy", csp);
    res.setHeader("X-WebKit-CSP", csp);
    res.setHeader("Expires", "Mon, 20 Jul 2009 23:00:00 GMT");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Pragma", "no-cache");
  }
});

module.exports = router;