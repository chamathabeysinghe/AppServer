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
router.get('/dashboard/school/new-school',function (req, res, next) {
    res.render('dashboard',{title:'New School',type: 'NewSchool'});
});
router.get('/school_dashboard',function (req, res, next) {
    res.render('school-dashboard',{title:'My School',type:'summary'})
});
module.exports = router;
