var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('../utils/config');

var UserSchema = new Schema({
    email: {
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
        type: String,
        required:true
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
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    learnKits: [{type:Schema.Types.ObjectId,ref: 'LearnKit'}]
});

UserSchema.pre('save',function (next) {
    var user = this;
    user.lastUpdate = Date.now();
    if(this.isModified('password')||this.isNew){
        user.password = bcrypt.hashSync(user.password,8);
        next();
    }
    else{
        return next();
    }
});

UserSchema.methods.comparePassword = function (password, callback) {
    console.log({id:this._id,role:this.role});
    var id = this.id;
    var role = this.role;
    bcrypt.compare(password,this.password,function (err, isMatch) {
        if(err){
            return callback(err);
        }
        if(isMatch){
            console.log({id:id,role:role});
            var token = jwt.sign({id:id,role:role}, config.secret,{expiresIn:config.tokenExpire});
            return callback(null,isMatch,token);
        }
        return callback(err,isMatch);
    })
};

module.exports = mongoose.model('User',UserSchema);
