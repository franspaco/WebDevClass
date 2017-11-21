var db = require('../../db.js');

exports.getHome = function (req, res) {
    if (req.session && req.session.username){
        console.log("SESSION: " + req.session.username);
        db.queries.posts(
            [req.session.lat, req.session.lon],
            function (err, result) {
                if(err){
                    res.render('feed',
                        {
                            title: 'Chirper | Home',
                            user: req.session.username,
                            score: 1,
                            posts: []
                        }
                    );
                }
                else{
                    console.log('Rendering feed');
                    let thing = result[0].timestamp;
                    console.log(JSON.stringify(thing));
                    res.render('feed',
                        {
                            title: 'Chirper | Feed',
                            user: req.session.username,
                            score: 1,
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
}