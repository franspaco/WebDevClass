var express = require('express');
var router = express.Router();
var gasolineriasController = require('../controllers/gasolinerasController');

router.get('/', gasolineriasController.getAll);

module.exports = router;
