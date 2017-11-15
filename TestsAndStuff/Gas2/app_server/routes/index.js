var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', indexController.homeController);

router.get('/login', indexController.login);

router.get('/session', indexController.session);

router.get('/register', indexController.register);

module.exports = router;
