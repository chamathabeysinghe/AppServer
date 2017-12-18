var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/find', function (req, res, next) {
    User.find(req.query).exec(function (err, users) {
        if(err){
            return res.json({success:false,error:err});
        }
        res.json(users)
    });
});

router.get('/last-updated/:id',function (req, res, next) {
    User.findById(req.params.id,function (err, user) {
        if(err){
            return res.json({success:false,error:err});
        }
        return res.json(user.lastUpdate);
    })
});

router.post('/register-school', function (req, res, next) {
    saveUser(req.body.userName, req.body.password, 'school', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
        res.json(result)
    });
});

router.post('/register-instructor', function (req, res, next) {
    saveUser(req.body.userName, req.body.password, 'instructor', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
        res.json(result)
    });
});

router.post('/register-driver', function (req, res, next) {
    saveUser(req.body.userName, req.body.password, 'driver', req.body.name, req.body.phone, req.body.address, req.body.picture, function (result) {
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


function saveUser(userName, password, role, name, phone, address, picture, callback) {
    var newUser = new User({
        userName: userName,
        password: password,
        role: role,
        name: name,
        phone: phone,
        address: address,
        picture: picture
    });

    newUser.save(function (err) {
        if (err) {
            result = {success: false, msg: 'Can not create the requested user', error: err};
            callback(result)
        }
        else {
            result = {success: true, msg: 'User created'};
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


module.exports = router;

