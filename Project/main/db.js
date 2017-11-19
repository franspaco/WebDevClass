var mysql = require('mysql');
var secret = require('./secrets');

var pool = {

};

exports.connect = function(done){
    pool = mysql.createPool({
        host: secret.db.host,
        user: secret.db.user,
        password: secret.db.password,
        port: '3306',
        database: 'chirper'
    });
    done();
};

exports.get = function () {
    return pool;
};