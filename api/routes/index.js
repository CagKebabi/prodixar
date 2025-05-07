var express = require('express');
var router = express.Router();

const config = require('../config') // config dosyasını import ettik. ../config/index yazmamaızın sebebi index.js adındaki dosyanın otomatik olarak import edilmesidir.

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ahmet', config });
});

module.exports = router;
