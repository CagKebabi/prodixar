var express = require('express');
var router = express.Router();
const isAuthenticated = true;

//Bütün istekleri kontrol ediyoruz. get post put delete gibi
router.all("*", (req, res, next) => {
    if(isAuthenticated){
        next()
    }else{
        res.json({
            message: "Unauthorized",
            sucess: false,
        })
    }
})

router.get('/', function(req, res, next) {
    res.json({
        message: "Categories",
        sucess: true,
    });
});

module.exports = router;