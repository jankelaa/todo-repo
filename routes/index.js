var express = require('express');
const { verifyAccessToken } = require('../helpers/jwt');
var router = express.Router();

/* GET home page. */
router.get('/', verifyAccessToken, (req, res, next) => {
  // console.log(req.headers['authorization']);
  res.render('index', { title: 'Express' });
});

module.exports = router;
