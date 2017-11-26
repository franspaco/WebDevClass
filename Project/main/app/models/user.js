var db = require('../../db.js');
defaultScore = 5;

exports.defScore = defaultScore;


exports.User = class User {
    constructor(id, username, email, score){
        this.id = id;
        this.username = username;
        this.email = email;
        this.score = score;
    }

    static findOrCreateFB(fbuser, callback){
        db.queries.getUserByFBID(fbuser.id,
            function (err, result) {
                console.log('here');
                if(err){
                    callback(err)
                }
                else {
                    if(result.length > 0){
                        console.log('User found');
                        callback(undefined, {
                            type: 'found',
                            user: result[0]
                        });
                    }else {
                        console.log('Registering User');
                        db.queries.register(
                            fbuser.name,
                            fbuser.email,
                            "NA",
                            "NA",
                            defaultScore,
                            fbuser.id,
                            function (err, res) {
                                if(err){
                                    callback(err);
                                }
                                else {
                                    callback(undefined, {
                                        type: 'created',
                                        user: res
                                    });
                                }
                            }
                        );
                    }
                }
            });
    }
};