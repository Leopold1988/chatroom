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

  console.log(req.method);
  console.log(req.headers);

  res.set({
    'Cache-Control': 'no-store',
    'ETag': '12345'
  });

  res.render('index.jade', { title : 'User', user : user });
});

module.exports = router;
