var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {});//render renderizza la pagina html  di index (h1 Simple Express App)
    
})

module.exports = router
