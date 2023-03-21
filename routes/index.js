var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Smart Contract Operations', heading: 'Smart Contract' });
});

module.exports = router;
