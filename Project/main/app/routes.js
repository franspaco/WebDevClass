var express = require('express');
var router = express.Router();

var homeController = require('./controllers/homeController');
var userController = require('./controllers/users');

router.get('/', homeController.getHome);

router.post('/login', userController.login);

router.post('/logout', userController.logout);
router.get('/logout', userController.logout);

router.post('/register', userController.create);

module.exports = router;