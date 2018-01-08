var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LearnKitSchema = new Schema({
    serial:{
        type:String,
        unique:true,
        required: true
    },
    _school:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    },
    details: {
        type: String
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
});

LearnKitSchema.pre('save',function (next) {
    var learnKit = this;
    learnKit.lastUpdate = Date.now();
    next();
});

module.exports = mongoose.model('LearnKit',LearnKitSchema);

