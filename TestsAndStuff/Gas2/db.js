
var mysql = require('mysql');

var pool = {

};

exports.connect = function(done){
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'toor',
        port: '3306',
        database: 'gasolineras'
    });
    done();
}

exports.get = function () {
    return pool;
}