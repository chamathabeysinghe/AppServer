var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    userName: {
        type : String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: true
    },
    role: {
        type : String,
        required: true
    },
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    address: {
        type: String
    },
    picture: {
        type: String
    },
    enable: {
        type: Boolean,
        default: true
    },
    _school: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

UserSchema.pre('save',function (next) {
    var user = this;
    if(this.isModified('password')||this.isNew){
        user.password = bcrypt.hashSync(user.password,8);
        next();
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, callback) {
    bcrypt.comapare(password,this.password,function (err, isMatch) {
        if(err){
            return callbacke(err);
        }
        callback(null,isMatch);
    })
};

module.exports = mongoose.model('User',UserSchema);


