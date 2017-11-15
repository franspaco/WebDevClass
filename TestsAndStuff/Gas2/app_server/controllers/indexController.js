
exports.homeController = function (req,res){
    console.log('INDEX');
	res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
	var response = {status: 'ERROR', message: 'User not found!'}
	res.send(response);
};

exports.register = function(req, res){
	var response = {status: 'SUCCESS', message: 'User registered!',
        data: {user:{email:'paco'}}}
    res.send(response);
};

exports.session = function (req, res) {
    var response = {}
	if(req.session && req.session.email){
        data = {
            email: req.session.email
        };
	    response.status = 'SUCCESS';
	    response.message = "User already logged";
	    response.data = data;
    }
    else{
	    response.status = "ERROR";
	    response.status = "User not logged in";
    }
    res.send(response);
};