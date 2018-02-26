var socketio = require('socket.io');
var socketio_auth = require('socketio-auth');
var jwt = require('jsonwebtoken');
var config = require("../utils/config");

var sessions = {};
var learnKitLocations = {};

function init(server){
    var io = socketio(server);
    module.exports['io'] = io;
    socketio_auth(io,{
        authenticate: function (socket, data, callback) {
            var token = data.token;
            if(!token)
                return callback(null,false);
            jwt.verify(token,config.secret,function (err, decoded) {
               if(err){
                   return callback(null,false);
               }
               socket.client.user = decoded;
               return callback(null,true);
            });
        },
        postAuthenticate:function (socket, data) {
            var user = socket.client.user;

            if(!sessions[user.id]){
                console.log("Empty");
                var userSession = [socket.id];
                sessions[user.id] = userSession;
                console.log(sessions)
            }
            else{
                console.log("Not empty");
                sessions[user.id].push(socket.id);
                console.log(sessions);
            }

        }
    });
    io.on('connection',function (socket) {
    });
}

module.exports = {
    init:init,
    sessions:sessions,
    learnKitLocations:learnKitLocations
};
