var jwt = require('jsonwebtoken');
var config = require("../utils/config");

function verifyUser(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

function verifyInstructor(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err || decoded.role != 'instructor')
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

function verifyDriver(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err || decoded.role != 'driver')
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

function verifySchool(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({auth: false, message: 'No token provided.'});
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err || decoded.role != 'school')
            return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

module.exports = {user: verifyUser,school:verifySchool,driver:verifyDriver,instructor:verifyInstructor};