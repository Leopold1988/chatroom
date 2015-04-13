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

    res.set('Cache-Control', 'no-store');
    res.render('index.jade', { title : 'User', user : user });
});

module.exports = router;
