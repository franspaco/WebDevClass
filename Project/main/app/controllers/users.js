
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
            && !isBlank(post.password)
            && !isBlank(post.latitude)
            && !isBlank(post.longitude)){
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
                                console.log("GOOD LOGIN");
                                response.status = 1;
                                data.message = 'OK';
                                req.session.idUser = usr.idUser;
                                req.session.username = usr.username;
                                req.session.lat = post.latitude;
                                req.session.lon = post.longitude;
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
        res.send({status: 1});
    }
    else {
        res.send({status: 0});
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
            && !isBlank(post.pswd)
            && !isBlank(post.email)
            && !isBlank(post.pswd2)
            && !isBlank(post.latitude)
            && !isBlank(post.longitude)
            && (post.pswd === post.pswd2)) {
            console.log("Request is ok");
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(post.pswd, salt);
            var token = crypto.randomBytes(20).toString('hex');
            db.get().query('INSERT INTO User (username, email, pswd_hash, email_token, score) values (?,?,?,?,?)',
                [post.username, post.email, hash, token, 1],
                function (err, result) {
                    if (err) {
                        response.status = 0;
                        //data.debug = err;
                        if(err.errno === 1062){
                            data.message = 'Username already taken :(';
                        }else{
                            data.message = 'Could not create user :(';
                        }
                    }
                    else {
                        req.session.idUser = result.insertId;
                        req.session.username = post.username;
                        req.session.lat = post.latitude;
                        req.session.lon = post.longitude;
                        data.insertId = result.insertId;
                        response.status = 1;
                        data.message = "";
                        mailOptions = {
                            from: '"Chirper" <chirper@franspaco.com>',
                            to: post.email,
                            subject: 'Confirm your account',
                            html: '<html><body><h1>HELLO WOOP WOOP</h1><a href="localhost:3000/confirm/?=' + token + '">Click here :)</a> </body></html>'
                        };
                        console.log("EMAIL GETS SENT HERE");
                        /*emailer.get().sendMail(mailOptions,
                            function (error, info) {
                                if(error){
                                    console.log("ERROR");
                                    console.log(error);
                                }
                                else{
                                    console.log('Message sent: %s', info.messageId);
                                }
                            });*/
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

exports.email = function (req, res) {
    var token = crypto.randomBytes(20).toString('hex');
    mailOptions = {
        from: '"Chirper" <chirper@franspaco.com>',
        to: 'franspaco@gmail.com',
        subject: 'Confirm your account',
        html: '<h1>HELLO WOOP WOOP</h1><a href="http://localhost:3000/validate/?=' + token + '">Click here :)</a>'
    };
    console.log(mailOptions.html);
    emailer.get().sendMail(mailOptions,
        function (error, info) {
            if(error){
                console.log("ERROR");
                console.log(error);
            }
            else{
                console.log('Message sent: %s', info.messageId);
            }
        });
    res.send(mailOptions.html);
};

exports.validate = function (req, res) {
    if(req.query.code){
        console.log(req.query.code);
        db.queries.validateEmailToken(req.query.code,
            function (err, result) {
                if(err || result.changedRows === 0){
                    res.render('message',
                        {
                            title: 'Error | Chirper',
                            heading: 'Error',
                            message: 'Invalid code.'
                        }
                    );
                }
                else{
                    res.render('message',
                        {
                            title: 'Verified | Chirper',
                            message: 'Your email has been verified.',
                            heading: 'Suceess',
                            link: {
                                link: '/',
                                text: 'Click here to go back'
                            }
                        }
                    );
                }
            }
        );
    }
    else{
        res.render('message',
            {
                title: 'Error | Chirper',
                heading: 'Error',
                message: 'Invalid code.'
            }
        );
    }
};

exports.showUser = function(req, res){
    console.log(req.params);
}