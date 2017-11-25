var db = require('../../db.js');
var multer  = require('multer');
var upload = multer({ dest: '../../public/images/' });

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

exports.show = function (req, res) {
    if (req.session && req.session.username) {
        let post = req.params.post;
        db.queries.postById(
            post,
            req.session.lat,
            req.session.lon,
            req.session.idUser,
            function (err, result) {
                if (err) {
                    res.render('error', {
                        message: 'Post not found!',
                        error: {
                            status: '404 woops!',
                        }
                    });
                }
                else {
                    res.render('onepost', {
                        post: result[0],
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

exports.get = function (req, res) {
    if (req.session && req.session.username) {
        db.queries.posts(
            req.session.lat,
            req.session.lon,
            req.session.idUser,
            function (err, result) {
                if(err){
                    let response = {};
                    let data = {};
                    response.status = 0;
                    data.debug = err;
                    response.data = data;
                    res.send(response);
                }
                else{
                    let response = {};
                    let data = {};
                    response.status = 1;
                    data.data = result;
                    response.data = data;
                    res.send(response);
                }
            });
    }
    else{
        res.send({
            status: 0,
            data: {
                message: 'You need to log in'
            }
        });
    }
};

exports.litPost = function (req, res) {
    if (req.session && req.session.username) {
        let post = req.body;
        if( !(post.action === undefined) &&
            !(post.post   === undefined)){
            let callbackF = function (err, result) {
                if(err){
                    res.send({
                        status: 0,
                        data: {
                            message: 'Some error occurred',
                            debug: err
                        }
                    });
                }
                else {
                    res.send({
                        status: 1,
                        data: {
                            message: 'OK'
                        }
                    });
                }
            };
            if(post.action === '0'){
                db.queries.deleteLit(
                    req.session.idUser,
                    post.post,
                    callbackF
                );
            }
            else if(post.action === '1'){
                db.queries.insertLit(
                    req.session.idUser,
                    post.post,
                    callbackF
                );
            }
        }
    }
    else {
        res.send({
                status: 0,
                data: {
                    message: 'You need to log in'
                }
            });
    }
};

exports.create = function (req, res) {
    if (req.session && req.session.username) {
        if(!isBlank(req.body.content)){
            let attach = (req.files.image) ? req.files.image[0].filename : null;
            db.queries.createPost([
                req.session.idUser,
                req.body.content,
                attach,
                req.session.userScore,
                req.session.lat,
                req.session.lon
            ], function (err, result) {
                if(err){
                    res.render('message', {
                        heading: 'Could not upload post :(',
                        link: {
                            link: '/',
                            text: 'Go back'
                        }
                    });
                }
                else{
                    res.redirect('/p/' + result.insertId);
                }
            });
        }
        else {
            res.render('message', {
                heading: 'Your message is empty!',
                link: {
                    link: '/',
                    text: 'Go back'
                }
            });
        }
    }
    else {
        res.render('message', {
            heading: 'You need to lo in!',
            link: {
                link: '/',
                text: 'Go back'
            }
        });
    }
};