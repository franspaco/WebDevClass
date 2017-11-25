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

//Password reset
router.get('/forgot', userController.forgot);
router.post('/recover', userController.recover);
router.post('/reset', userController.reset);

//view
router.get('/u/:uname', userController.showUser);
//############################################
//                  POSTS
//############################################

//query all for user
router.get('/posts', postController.get);

//view
router.get('/p/:post', postController.show);
router.get('/u/:uname/:post', postController.show);

//lit
router.post('/lit', postController.litPost);

//Create new
var multer  = require('multer');
var upload = multer({ dest: 'public/images/' });
var stuff = upload.fields([{name: 'content'},{name: 'image'}]);
router.post('/newPost', stuff, postController.create);

module.exports = router;