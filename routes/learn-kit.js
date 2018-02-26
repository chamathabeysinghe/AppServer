var express = require('express');
var LearnKit = require('../models/LearnKit');
var SocketSessions = require('../utils/SocketSession');

var router = express.Router();

router.get('/find',function (req, res, next) {
    LearnKit.find(req.query).populate('_school').exec(function (err, learnkits) {
        if(err){
            return res.json({success:false,error:err});
        }
        res.json(learnkits);
    })
});

router.post('/register-learnkit',function (req, res, next) {
    saveLearnKit(req.body.serial,function (result) {
        return res.json(result);
    })
});

router.post('/assign-school',function (req, res, next) {
    assignToSchool(req.body.learnkitId,req.body.schoolId,function (result) {
        res.json(result);
    })
});


/**
 * This is very important keep in mind
 */
// router.get('/test-sockets',function (req, res, next) {
//     var sessions = SocketSessions.sessions;
//     for(var key in sessions){
//         console.log(key+"   "+sessions[key]);
//         sessionIds = sessions[key];
//         for(var i=0;i<sessionIds.length;i+=1){
//             console.log(sessionIds[i]);
//             var socket = (SocketSessions.io.sockets.sockets[sessionIds[i]]);
//         }
//
//     }
// });

/** get updates from raspberry pi
 *
 */
router.post('/location-update-from-pi',function (req, res, next) {
   var schoolId =  req.body.schoolId;
   var kitId = req.body.kitId;
   var longitude = req.body.longitude;
   var latitude = req.body.latitude;
   var details = req.body.details;
   if(!SocketSessions.learnKitLocations[schoolId]){
       SocketSessions.learnKitLocations[schoolId] = {kitId:[longitude,latitude,details]}
   }
   else{
       SocketSessions.learnKitLocations[schoolId][kitId] = [longitude,latitude,details];
   }

   sendLocationInfoToSchool(schoolId,SocketSessions.learnKitLocations[schoolId]);
   return res.json({status:'success'});

});

router.post('/update-location',function (req, res, next) {
    var schoolId = req.body.schoolId;
    // var locationInfo = req.body.locationInfo;
    var locationInfo = [
        {
            id:'#123',
            latitude:6.795013,
            longitude:79.904053,
            active: true,
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
                }
            }
        },
        {
            id:'#124',
            latitude:6.796344,
            longitude:79.895733,
            active: true,
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
                }
            }
        },
        {
            id:'#125',
            latitude:6.796429,
            longitude:79.900883,
            active: true,
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
                }
            }
        }
    ];

    sendLocationInfoToSchool(schoolId,locationInfo);
    return res.json({status:'success'})
});


function sendLocationInfoToSchool(schoolId,locationInfo){
    var schoolSocketIds = SocketSessions.sessions[schoolId];
    for(var i=0;i<schoolSocketIds.length;i+=1){
        var socket = SocketSessions.io.sockets.sockets[schoolSocketIds[i]];
        socket.emit('locationUpdate',locationInfo);
    }
}

function saveLearnKit(serial,callback) {
    var newLearnKit = new LearnKit({
        serial: serial
    });

    newLearnKit.save(function (err) {
        if (err) {
            result = {success: false, msg: 'Can not create the requested device', error: err};
            callback(result)
        }
        else {
            result = {success: true, msg: 'Device created'};
            callback(result)
        }
    })
}

function assignToSchool(learnkitId, schoolId,callback) {
    LearnKit.findById(learnkitId,function (err, learnkit) {
        if(err){
            result = {success:false,msg:'Could not find the specified learn it',error:err};
            return callback(result);
        }
        learnkit._school = schoolId;
        learnkit.save(function (err, updatedLearnKit) {
            if(err){
                result = {success:false,msg:'Could not update the learnkit',error:err};
                return callback(result);
            }
            result = {success:true,msg:'Assigned learnkit to school'};
            return callback(result);
        })
    })
}
module.exports = router;
