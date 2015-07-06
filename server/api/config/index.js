'use strict';

var express = require('express');
var controller = require('./config.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.index);
router.get('/test', controller.test);

module.exports = router;
