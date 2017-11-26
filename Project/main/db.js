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
    register: function (username, email, hash, token, score, fbId, callback) {
        let query = 'INSERT INTO User (username, email, pswd_hash, email_token, score, fbId) values (?,?,?,?,?,?)';
        pool.query(query,[username, email, hash, token, score, fbId], callback);
    },
    posts: function(lat, lon, usrId, callback){
        let query = `
            SELECT username, idPost, content, attach, timestamp, Post.score, IFNULL(litCount,0) as litCount, dist, coalesce(usrLikes, 0) AS usrLits
            FROM (
                select *, distancia(?,?,latitude,longitude) as dist
                FROM Post
            ) AS Post
            INNER JOIN User
            ON Post.user = User.idUser
            LEFT JOIN (
                SELECT post, count(*) as litCount, count(case user when (?) then 1 else null end) AS usrLikes
                FROM Lit
                group by post
            ) AS postLits
            ON Post.idPost = postLits.post
            WHERE dist < Post.score
            ORDER BY timestamp DESC
            `;
        pool.query(query, [lat, lon, usrId], callback);
    },
    postById: function (id, lat, lon, usrId, callback) {
        let query = `
            SELECT username, idPost, content, attach, timestamp, Post.score, IFNULL(litCount,0) as litCount, dist, coalesce(usrLikes, 0) AS usrLits
            FROM (
                select *, distancia(?,?,latitude,longitude) as dist
                FROM Post
            ) AS Post
            INNER JOIN User
            ON Post.user = User.idUser
            LEFT JOIN (
                SELECT post, count(*) as litCount, count(case user when (?) then 1 else null end) AS usrLikes
                FROM Lit
                group by post
            ) AS postLits
            ON Post.idPost = postLits.post
            WHERE idPost = ?
            ORDER BY timestamp DESC
            `;
        pool.query(query, [lat, lon, usrId, id], callback);
    },
    postByUser: function (username, lat, lon, usrId, callback) {
        let query = `
            SELECT username, idPost, content, attach, timestamp, Post.score, IFNULL(litCount,0) as litCount, dist, coalesce(usrLikes, 0) AS usrLits
            FROM (
                select *, distancia(?,?,latitude,longitude) as dist
                FROM Post
            ) AS Post
            INNER JOIN User
            ON Post.user = User.idUser
            LEFT JOIN (
                SELECT post, count(*) as litCount, count(case user when (?) then 1 else null end) AS usrLikes
                FROM Lit
                group by post
            ) AS postLits
            ON Post.idPost = postLits.post
            WHERE username = ?
            ORDER BY timestamp DESC
            `;
        pool.query(query, [lat, lon, usrId, username], callback);
    },
    createPost: function (params, callback) {
        let query = `
            INSERT INTO Post (user, content, attach, score, latitude, longitude)
            values (?, ?, ?, ?, ?, ?)
        `;
        pool.query(query, params, callback);
    },
    insertLit: function (user, post, callback) {
        let query = `
            INSERT INTO Lit values(?,?)
        `;
        pool.query(query, [user, post], callback);
    },
    deleteLit: function (user, post, callback) {
        let query = `
            DELETE FROM Lit WHERE user=? AND post=?
        `;
        pool.query(query, [user, post], callback);
    },
    getUserById: function(id, callback){
        let query = 'SELECT * FROM User WHERE idUser=?';
        pool.query(query, [id], callback);
    },
    getUserByName: function(name, callback){
        let query = 'SELECT * FROM User WHERE username=?';
        pool.query(query, [name], callback);
    },
    getUserByFBID: function (id, callback) {
        let query = 'SELECT * FROM User WHERE fbId=?';
        pool.query(query, [id], callback);
    },
    validateEmailToken: function(token, callback){
        let query = 'UPDATE User SET verified=1, email_token=null WHERE email_token=?';
        pool.query(query, [token], callback);
    },
    setRecoverToken: function(username, token, callback){
        let query = 'UPDATE User SET pswd_token=? WHERE username=? AND verified=1';
        pool.query(query, [token, username], callback);
    },
    setNewPassword: function (hash, token, callback) {
        let query = 'UPDATE User SET pswd_token=null, pswd_hash=? WHERE pswd_token=?';
        pool.query(query, [hash, token], callback);
    }
};