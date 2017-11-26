var db = require('../../db.js');

exports.getHome = function (req, res) {
    if (req.session && req.session.username){
        console.log("SESSION: " + req.session.username);
        if(!req.session.lat || !req.session.lon){
            res.redirect('/location');
            return;
        }
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
                            lat: req.session.lat,
                            lon: req.session.lon,
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
                            lat: req.session.lat,
                            lon: req.session.lon,
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