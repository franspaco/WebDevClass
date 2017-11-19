
var secret = require('./secrets');

exports.options = {
    host: secret.db.host,
    user: secret.db.user,
    password: secret.db.password,
    port: '3306',
    database: 'chirper'
};