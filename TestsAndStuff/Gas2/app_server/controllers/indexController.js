
exports.homeController = function (req,res){
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