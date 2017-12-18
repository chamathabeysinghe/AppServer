var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/User');


var SessionSchema = new Schema({
        _driver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        _instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: "started"
        },
        report: {
            type: String
        }
    },
    {
        timestamps: {createdAt: 'created_at'}
    }
);

SessionSchema.pre('save',function (next) {
    var session = this;
    User.findById(session._instructor,function (err, user) {
        user.save();
    });
    User.findById(session._driver,function (err, user) {
        user.save();
    });
    next();
});

module.exports = mongoose.model('Session', SessionSchema);


