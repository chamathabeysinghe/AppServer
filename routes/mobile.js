var express = require('express');
var router = express.Router();

router.get('/',function (req, res, next) {

    var summary = {
        name: 'Chamath Abeysinghe',
        image: 'https://avatars2.githubusercontent.com/u/7922767?s=460&v=4',
        progress: 77,
        trials: '2017/8/9',
        achievements:{},
        goals: [
            {goal:"Practice revers",completion:80},
            {goal:"Gear transmission", completion:50}
        ],
        lastSessionSummary:{
            instructor:{
                id:'#543',
                name:'Kapila Dissanayake',
                image:'/images/src/kapila_dissanayake.jpg'
            },
            trainee:{
                id:'#4321',
                name:'Kalum Lakmal',
                image: 'images/src/na.jpg'
            },
            session:{
                startTime: '1517805831',
                startLocation:{
                    latitude:6.794522,
                    longitude: 79.901419
                },
                endTime: '14564563',
                endLocation: {
                    latitude:6.794522,
                    longitude: 79.901419
                },
                distance:10,
                route:[],
                issues: [
                    {issue:'high speed',location:[6.794530,79.901425]},
                    {issue:'high speed',location:[6.794530,79.901425]}
                ]
            }
        }
    };

    res.json(summary);
});

module.exports = router;