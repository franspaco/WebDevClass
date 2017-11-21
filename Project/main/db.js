var mysql = require('mysql');
var secret = require('./secrets');
//var fs = require('fs');

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
    //console.log(fs.readFileSync('sql/posts.sql', "utf8"));
    done();
};

exports.get = function () {
    return pool;
};

exports.queries = {
    posts: function(params, result){
        let query = `
            SELECT username, content, attach, timestamp, Post.score, IFNULL(litCount,0) as litCount, dist
            FROM (
                select *, distancia(?,?,latitude,longitude) as dist
                FROM Post
            ) AS Post
            INNER JOIN User
            ON Post.user = User.idUser
            LEFT JOIN (
                SELECT post, count(*) as litCount
                FROM Lit
                group by post
            ) AS postLits
            ON Post.idPost = postLits.post
            WHERE dist < Post.score
            ORDER BY timestamp DESC
            `;
        pool.query(query, params, result);
    },
    getUserId: function(id, result){
        let query = 'SELECT * FROM User WHERE idUser=?';
        pool.query(query, [params], result);
    },
    getUserName: function(name, result){
        let query = 'SELECT * FROM User WHERE username=?';
        pool.query(query, [params], result);
    },
    validateEmailToken: function(token, result){
        let query = 'UPDATE User SET verified=1, email_token=null WHERE email_token=?';
        pool.query(query, [token], result);
    }
};