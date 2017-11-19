

exports.getHome = function (req, res) {
    if (req.session && req.session.username){
        console.log("SESSION: " + req.session.email);
        res.render('feed', {title: 'Chirper | Home'});
    }
    else {
        res.render('index', {title: 'Chirper | Home'});
    }
}