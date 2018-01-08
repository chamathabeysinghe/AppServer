var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/dashboard', function (req, res, next) {
    res.render('dashboard',{title:'School',type:1});
});
router.get('/dashboard/learnkit',function (req, res, next) {
    res.render('dashboard',{title:'Learn kits',type:'LearnKit'})
});
module.exports = router;
