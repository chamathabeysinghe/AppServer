var socketio = require('socket.io');
var socketio_auth = require('socketio-auth');
var jwt = require('jsonwebtoken');
var config = require("../utils/config");

var sessions = {};

function init(server){
    var io = socketio(server);
    module.exports['io'] = io;
    socketio_auth(io,{
        authenticate: function (socket, data, callback) {
            //get credentials sent by the client
            // var username = data.username;
            // var password = data.password;
            // var jwtToken = data.token;
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
            console.log("################################################################Authenticated");
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
        console.log("******************************************************************************************Fucking Client Connected");
    });
}

module.exports = {
    init:init,
    sessions:sessions,
};
