var db = require('../../db.js');

exports.getHome = function (req, res) {
    if (req.session && req.session.username){
        console.log("SESSION: " + req.session.username);
        db.queries.posts(
            req.session.lat,
            req.session.lon,
            req.session.idUser,
            function (err, result) {
                if(err){
                    res.render('feed',
                        {
                            title: 'Chirper | Home',
                            user: req.session.username,
                            score: req.session.userScore,
                            posts: []
                        }
                    );
                }
                else{
                    res.render('feed',
                        {
                            title: 'Chirper | Feed',
                            user: req.session.username,
                            score: req.session.userScore,
                            posts: result
                        }
                    );
                }
            }
        );
    }
    else {
        res.render('index', {title: 'Chirper | Home'});
    }
};