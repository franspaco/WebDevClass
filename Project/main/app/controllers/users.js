
var db = require('../../db.js');
var emailer = require('../../email');
var bcrypt = require('bcrypt');
var crypto = require("crypto");

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

exports.login = function (req, res) {
    console.log("Log-in attempt");
    var response = {};
    var data = {};
    if (req.session && req.session.username) {
        response = {
            status: 0,
            data: {
                message: 'You are already logged in!'
            }
        };
        res.send(response)
    }
    else {
        var post = req.body;
        if(!isBlank(post.username)
            && !isBlank(post.password)){
            db.get().query(
                'SELECT * FROM User WHERE username=?',
                [post.username],
                function (err, result) {
                    if (err) {
                        response.status = 0;
                        data.message = err;
                    }
                    else {
                        console.log(result);
                        var usr = result[0];
                        if(usr){
                            if(bcrypt.compareSync(post.password, usr.pswd_hash)){
                                console.log("GOD LOGIN");
                                response.status = 1;
                                data.message = 'OK';
                                req.session.idUser = usr.idUser;
                                req.session.username = usr.username;
                            }
                            else{
                                response.status = 0;
                                data.message = 'Wrong password';
                            }
                        }
                        else {
                            response.status = 0;
                            data.message = 'User not found!';
                        }
                    }
                    response.data = data;
                    res.send(response);
                }
            );
        }
        else {
            response.status = 0;
            data.message = 'Invalid values!';
            response.data = data;
            res.send(response);
        }
    }
};

exports.logout = function (req, res) {
    if (req.session && req.session.username) {
        req.session.destroy();
        res.send({status: 'you logged out'});
    }
    else {
        res.send("YOU ARE ALREADY LOGGED OUT!? WTF")
    }
};

exports.create = function (req, res) {
    console.log("Create user!");
    var response = {};
    var data = {};
    if (req.session && req.session.username) {
        response = {
            status: 0,
            data: {
                message: 'You are already logged in!'
            }
        };
        response.data = data;
        res.send(response);
    }
    else {
        var post = req.body;
        console.log(post);
        if(!isBlank(post.username)
            && !isBlank(post.password)
            && !isBlank(post.email)
            && !isBlank(post.password2) ) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(post.password, salt);
            var token = crypto.randomBytes(20).toString('hex');
            db.get().query('INSERT INTO User (username, email, pswd_hash, email_token, score) values (?,?,?,?)',
                [post.username, post.email, hash, token, 1],
                function (err, result) {
                    if (err) {
                        response.status = 0;
                        data.message = err;
                    }
                    else {
                        data.insertId = result.insertId;
                        response.status = 1;
                        data.message = "";
                        emailer.get()
                    }
                    response.data = data;
                    res.send(response);
                });
        }
        else {
            response.status = 0;
            data.message = 'Invalid data!';
            response.data = data;
            res.send(response);
        }
    }
};