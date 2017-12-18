var express = require('express');
var router = express.Router();
var Session = require('../models/Session');

router.get('/find', function (req, res, next) {
    Session.find(req.query).exec(function (err, sessions) {
        res.json(sessions)
    });
});

router.post('/register-session', function (req, res, next) {
    var newSession = new Session({
        _driver: req.body._driver,
        _instructor: req.body._instructor
    });

    newSession.save(function (err,session) {
        if (err) {
            return res.json({success: false, msg: 'Could not start new session', error: err});
        }
        return res.json({success: true, msg: 'Create new session',session:session});
    });
});

router.post('/close-session',function (req, res, next) {
    console.log(req.body.sessionId);
   Session.findById(req.body.sessionId,function (err,session) {
       if(err){
           return res.json({success:false,msg:'Could not find the session',error:err});
       }
       session.report = req.body.report;
       session.status = 'finished';
       session.save(function (err, updatedSession) {
           if(err){
               return res.json({success:false,msg:'Could not update the session',error:err});
           }
           return res.json({success:true,msg:'Session finished'});
       })
   })
});

module.exports = router;

