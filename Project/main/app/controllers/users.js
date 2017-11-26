
var db = require('../../db.js');
var emailer = require('../../email');
var bcrypt = require('bcrypt-nodejs');
var crypto = require("crypto");
var passport = require('passport');
var user = require('../models/user');

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
                        //console.log(result);
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
                                req.session.userScore = usr.score;
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

exports.logoutGet = function (req, res) {
    if (req.session && req.session.username) {
        req.session.destroy();

    }
    res.redirect('/');
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
        //console.log(post);
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
            db.queries.register(post.username, post.email, hash, token, user.defScore, null,
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
                        req.session.userScore = user.defScore;
                        req.session.lat = post.latitude;
                        req.session.lon = post.longitude;
                        data.insertId = result.insertId;
                        response.status = 1;
                        data.message = "";
                        confirmEmail(post.email, token,
                            function (error, info) {
                                if(error){
                                    console.log("ERROR");
                                    console.log(error);
                                }
                                else{
                                    console.log('Message sent: %s', info.messageId);
                                }
                            }
                        );
                    }
                    response.data = data;
                    res.send(response);
                }
            );
        }
        else {
            response.status = 0;
            data.message = 'Invalid data!';
            response.data = data;
            res.send(response);
        }
    }
};


exports.validate = function (req, res) {
    if(req.query.code){
        //console.log(req.query.code);
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
    if (req.session && req.session.username) {
        let uname = req.params.uname;
        db.queries.postByUser(
            uname,
            req.session.lat,
            req.session.lon,
            req.session.idUser,
            function (err, result) {
                if (err) {
                    res.render('error', {
                        message: 'Stuff not found!',
                        error: {
                            status: '404 woops!',
                        }
                    });
                }
                else {
                    //console.log(result);
                    res.render('user_feed', {
                        displayUsername: uname,
                        posts: result,
                        score: req.session.userScore,
                        user: req.session.username
                    });
                }
            });
    }
    else{
        res.render('message', {
            heading: 'You need to lo in!',
            link: {
                link: '/',
                text: 'Go back'
            }
        });
    }
};

exports.forgot = function (req, res){
    if (req.session && req.session.username) {
        res.redirect('/');
    }
    else{
        if(req.query.code){
            req.session.resetToken = req.query.code;
            res.render('input',
                {
                    heading: 'Recover password',
                    type: 'password'
                }
            );
        }
        else {
            res.render('input',
                {
                    heading: 'Recover password',
                    message: 'Enter your username and we\'ll send you an email.',
                    type: 'username'
                });
        }
    }
};

exports.recover = function (req, res) {
    if (req.session && req.session.username) {
        response = {
            status: 0,
            data: {
                message: 'You are already logged in!'
            }
        };
        res.send(response);
    }
    else{
        // No session found
        let post = req.body;
        if(!isBlank(post.username)){
            // Params OK
            db.queries.getUserByName(post.username,
                function (err, result) {
                    // Get user from username
                    if(err){
                        // User not found
                        response.status = 0;
                        data.message = 'Username not found!';
                        response.data = data;
                        res.send(response);
                    }
                    else{
                        // Found user
                        let user = result[0];
                        //console.log(user.email);
                        let token = crypto.randomBytes(30).toString('hex');
                        db.queries.setRecoverToken(post.username, token,
                            function (err, result) {
                            // Update token
                                let response = {};
                                let data = {};
                                if(err || result.changedRows === 0){
                                    response.status = 0;
                                    data.message = 'Sorry, your email is not verified!';
                                    response.data = data;
                                    res.send(response);
                                }
                                else{
                                    resetPasswordEmail(user.email, token,
                                        function (error, info) {
                                            if(error){
                                                response.status = 0;
                                                data.message = 'Error. Please try again.';
                                                console.log("ERROR");
                                                console.log(error);
                                            }
                                            else{
                                                response.status = 1;
                                                data.message = 'Email sent!';
                                                console.log('Message sent: %s', info.messageId);

                                            }
                                            response.data = data;
                                            res.send(response);
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            );
        }
        else {
            response = {
                status: 0,
                data: {
                    message: 'Invalid data!'
                }
            };
            res.send(response);
        }
    }
};

exports.reset = function (req, res) {
    if (req.session && req.session.resetToken) {
        let token = req.session.resetToken;
        req.session.destroy();
        let post = req.body;
        if( !isBlank(post.pswd)  &&
            !isBlank(post.pswd2) &&
            post.pswd === post.pswd2){
            console.log('Got here');
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(post.pswd, salt);
            db.queries.setNewPassword(hash, token,
                function (err, result) {
                    if(err || result.changedRows === 0){
                        response = {
                            status: 0,
                            data: {
                                message: 'Failed to update password!'
                            }
                        };
                        res.send(response);
                    }
                    else {
                        response = {
                            status: 1,
                            data: {
                                message: 'Password updated!'
                            }
                        };
                        res.send(response);
                    }
                }
            );
        }
        else {
            response = {
                status: 0,
                data: {
                    message: 'Invalid data!'
                }
            };
            res.send(response);
        }
    }
    else {
        response = {
            status: 0,
            data: {
                message: 'Invalid data!'
            }
        };
        res.send(response);
    }
};

exports.fbLogin = passport.authenticate('facebook',{ scope: ['email']});

exports.fbCallback =
    passport.authenticate('facebook', {
        failureRedirect: '/',
        successRedirect : '/location'
    });

exports.askLocation = function (req, res) {
    console.log(req.session);
    res.render('askLocation',{
        heading: 'Please provide your location',
        message: '',
        link: {
            link: '/',
            text: 'Click here to go back'
        }
    });
};

exports.getLocation = function (req, res) {
    let post = req.body;
    if( !isBlank(post.latitude) &&
        !isBlank(post.longitude)){
        req.session.lat = post.latitude;
        req.session.lon = post.longitude;
        response = {
            status: 1,
            data: {
                message: 'Ok'
            }
        };
        res.send(response);
    }else{
        response = {
            status: 0,
            data: {
                message: 'Invalid data!'
            }
        };
        res.send(response);
    }
};

function resetPasswordEmail(to, token, result){
    let html = `
        <html>
            <body>
                <h1>Please click the link to reset your password</h1> 
                <a href="http://localhost:3000/forgot?code=` + token + `">Click here :)</a>
            </body>
        </html>`
    sendEmail(to, 'Reset your password', html, result);
}

function confirmEmail(to, token, result){
    let html = `
        <html>
            <body>
                <h1>Please confirm your email</h1> 
                <a href="http://localhost:3000/validate?code=` + token + `">Click here :)</a>
            </body>
        </html>`
    sendEmail(to, 'Confirm your email', html, result);
}

function sendEmail(to, subject, html, result){
    mailOptions = {
        from: '"Chirper" <chirper@franspaco.com>',
        to: to,
        subject: subject,
        html: html
    };
    console.log("EMAIL GETS SENT HERE");
    emailer.get().sendMail(mailOptions, result);
}

