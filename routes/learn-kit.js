var express = require('express');
var LearnKit = require('../models/LearnKit');

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
