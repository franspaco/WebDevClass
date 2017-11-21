var nodemailer = require('nodemailer');
var secret = require('./secrets');

var mailer = {};

poolConfig = {
    pool: true,
    host: secret.email.host,
    port: '465',
    secure: true,
    auth: {
        user: secret.email.user,
        pass: secret.email.pass
    }
};

exports.connect = function () {
    mailer = nodemailer.createTransport(poolConfig);
};


exports.get = function () {
    return mailer
};