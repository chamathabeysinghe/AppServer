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

router.get('/get-session-details/:id',function (req, res, next) {
    // console.log(req.params.id)
   var sessionDetails = {
       route: [(6.811294, 79.884334),(6.811560, 79.886308)],
       duration: "1h:12min:32sec",
       distance: "12.4km",
       instructor: {
           name: "Mr Achala Edirisooriya",
           image: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/6/000/2a9/04f/377b8fb.jpg"
       },
       feedback: {
           rating: 4.3,
           comment: "Blahhh..... blahhh blaahhhh blahhhhhh"
       },
       errors : [{type:'high-speed',location:(6.811294, 79.884334), details:'Speed Limit is 40kmph but drove at 50kmph'}
       ,{type:'cross-line',location:(6.811294, 79.884334), details:'Speed Limit is 40kmph but drove at 50kmph'}]
   };
   return res.json(sessionDetails);
});

router.get('/goal-details',function (req, res, next) {
    var goalDetails = [
        {
            title: 'Drive 100KMs',
            category: 'drive',
            progress: 75
        },
        {
            title: 'Train reverse',
            category: 'reverse',
            progress: 12
        },
        {
            title: 'Overtake vehicles',
            category: 'overtake',
            progress: 25
        },
        {
            title: 'Drive 100KMs',
            category: 'drive',
            progress: 75
        },
        {
            title: 'Train reverse',
            category: 'reverse',
            progress: 12
        },
        {
            title: 'Overtake vehicles',
            category: 'overtake',
            progress: 25
        },
        {
            title: 'Drive 100KMs',
            category: 'drive',
            progress: 75
        },
        {
            title: 'Train reverse',
            category: 'reverse',
            progress: 12
        },
        {
            title: 'Overtake vehicles',
            category: 'overtake',
            progress: 25
        },

    ];

    return res.json(goalDetails);
});

module.exports = router;

