var db = require('../../db.js');

exports.get = function (req, res) {
    if (req.session && req.session.username) {
        db.queries.posts(
            [req.session.lat,
            req.session.lon],
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
                    console.log(result);
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
        res.send(
            {
                status: 0,
                data: {
                    message: 'You need to log in'
                }
            }
        );
    }
};