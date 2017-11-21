var express = require('express');
var router = express.Router();

var homeController = require('./controllers/homeController');
var userController = require('./controllers/users');
var postController = require('./controllers/posts');


//############################################
//                 HOME
//############################################
router.get('/', homeController.getHome);


//############################################
//                 USERS
//############################################
//Login
router.post('/login', userController.login);

//Logout
router.post('/logout', userController.logout);
router.get('/logout', userController.logout);

//Register
router.post('/register', userController.create);

//Confirm
router.get('/validate', userController.validate);
router.get('/testemail', userController.email);

//view
router.get('/u/:uname', userController.showUser);
//############################################
//                  POSTS
//############################################

//query all for user
router.get('/posts', postController.get);

//view
router.get('/u/:uname/:post', (req, res) => {
    res.send('lol');
});

module.exports = router;