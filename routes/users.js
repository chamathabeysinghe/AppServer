var express = require('express');
var router = express.Router();
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var VerifyToken = require('../utils/VerifyToken');
var LearnKit = require('../models/LearnKit');
var SocketSessions = require('../utils/SocketSession');

router.get('/find', function (req, res, next) {
    User.find(req.query).exec(function (err, users) {
        if (err) {
            return res.json({success: false, error: err});
        }
        res.json(users)
    });
});

router.get('/find-school', function (req, res, next) {
    filter = req.query;
    filter['role'] = 'school';
    User.find(filter).exec(function (err, schools) {
        if (err) {
            return res.json({success: false, error: err});
        }
        res.json(schools);

    })
});

router.get('/last-updated/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.json({success: false, error: err});
        }
        return res.json(user.lastUpdate);
    })
});

// router.post('/register-school', function (req, res, next) {
//     saveUser(req.body.email, req.body.password, 'school', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
//         // if (result.success) {
//         //     learnkitIds = req.body.learnKits;
//         //     console.log(learnkitIds);
//         //     for (var i = 0; i < learnkitIds.length; i++) {
//         //         for (var i = 0; i < learnkitIds.length; i++) {
//         //             assignToSchool(learnkitIds[i], result.savedUser._id, function () {
//         //
//         //             })
//         //         }
//         //     }
//         //     res.json(result)
//         // }} ;
//     });

router.post('/register-school',function (req, res, next) {
    saveUser(req.body.email, req.body.password, 'school', req.body.name, req.body.phone, req.body.address, req.body.picture,function (result) {
        if(result.success){
            learnKitIds = req.body.learnKits;
            for(var i=0;i<learnKitIds.length;i++){
                assignToSchool(learnKitIds[i],result.savedUser._id,function () {

                })
            }
        }
    })
});

router.post('/register-instructor', function (req, res, next) {
    saveUser(req.body.email, req.body.password, 'instructor', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
        res.json(result)
    });
});

router.post('/register-driver', function (req, res, next) {
    saveUser(req.body.email, req.body.password, 'driver', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
        res.json(result)
    });
});

router.post('/assign-driver', function (req, res, next) {
    assignUserToSchool(req.body.userId, req.body.schooldId, function (result) {
        res.json(result);
    })
});

router.post('/assign-instructor', function (req, res, next) {
    assignUserToSchool(req.body.userId, req.body.schooldId, function (result) {
        res.json(result);
    })
});

router.post('/login', function (req, res, next) {
    User.findOne({email: req.body.email}, function (err, user) {
        if (err || !user) {
            res.status(401);
            return res.json({success: false, msg: "Could not find the user", error: err})
        }
        user.comparePassword(req.body.password, function (err, isMatch, token,role) {
            if (isMatch && !err) {
                return res.json({success: true, msg: "Authentication completed", token: token,role:role});
            }
            res.status(401);
            return res.json({success: false, msg: "Incorrect password", error: err});
        })
    });
});

/**
 * This is very important keep in mind
 */
router.get('/test-sockets',function (req, res, next) {
    var sessions = SocketSessions.sessions;
    for(var key in sessions){
        console.log(key+"   "+sessions[key]);
        sessionIds = sessions[key];
        for(var i=0;i<sessionIds.length;i+=1){
            console.log(sessionIds[i]);
            var socket = (SocketSessions.io.sockets.sockets[sessionIds[i]]);
            socket.emit('update',"FICKKK LICKKK")
        }

    }
});

router.post('update-location',function (req, res, next) {
    var schoolId = req.body.schoolId;
    var locationInfo = req.body.locationInfo;
    sendLocationInfoToSchool(schoolId,locationInfo);
    return res.json({status:'success'})
});

function sendLocationInfoToSchool(schoolId,locationInfo){
    schoolSocketIds = SocketSessions.sessions[schoolId];
    for(var i=0;i<schoolSocketIds.length;i+=1){
        var socket = SocketSessions.io.sockets.sockets[schoolSocketIds[i]];
        socket.emit('locationUpdate',locationInfo);
    }
}

router.get('/school-summary',VerifyToken.school,function (req, res, next) {
    var sampleSummary = {
        totalTrainees:10,
        totalVehicles:3,
        currentSessions:2,
        mapInfo:[
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
        ]
    };
   res.json(sampleSummary);
});

function saveUser(email, password, role, name, phone, address, picture, callback) {
    var newUser = new User({
        email: email,
        password: password,
        role: role,
        name: name,
        phone: phone,
        address: address,
        picture: picture
    });

    newUser.save(function (err, savedUser) {
        if (err) {
            result = {success: false, msg: 'Can not create the requested user', error: err};
            callback(result)
        }
        else {
            result = {success: true, msg: 'User created', savedUser: savedUser};
            callback(result)
        }
    })
}

function assignUserToSchool(userId, schoolId, callback) {
    User.findById(userId, function (err, user) {
        if (err) {
            result = {success: false, msg: 'Could not find the specified user', error: err};
            return callback(result);
        }
        user._school = schoolId;
        user.save(function (err, updatedUser) {
            if (err) {
                result = {success: false, msg: 'Could not update the user', error: err};
                return callback(result);
            }
            result = {success: true, msg: 'Assign school to user'};
            return callback(result);
        })
    });
}

function assignToSchool(learnkitId, schoolId, callback) {
    console.log(learnkitId)
    LearnKit.findById(learnkitId, function (err, learnkit) {
        if (err) {

            result = {success: false, msg: 'Could not find the specified learn it', error: err};
            console.log(err)
            return callback(result);
        }
        learnkit._school = schoolId;
        learnkit.save(function (err, updatedLearnKit) {
            if (err) {
                console.log("ERrror Occured2222222222222");
                result = {success: false, msg: 'Could not update the learnkit', error: err};
                return callback(result);
            }

            result = {success: true, msg: 'Assigned learnkit to school'};
            return callback(result);
        })
    })
}

module.exports = router;
