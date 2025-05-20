var express = require('express');
var router = express.Router();

// const config = require('../config') // config dosyasını import ettik. ../config/index yazmamaızın sebebi index.js adındaki dosyanın otomatik olarak import edilmesidir.

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Ahmet', config });
// });

// Yukarıdaki gibi tüm routeslarımızı tek tek tanımlamak yerine dinamik routes yapısı kullanacağız.
// Yapacağımız şey roıtes klasörünü okuyup içerisindeki dosyaları dinamik olarak routing yapısına eklemek
// Öncelikle dosya işlemlerinde kullanacağımız fs kütüphanesini tanımlıyoruz.
const fs = require('fs');

// routes klasörünü okuyup içerisindeki dosyaları dinamik olarak routing yapısına eklemek için aşağıdaki kodu yazıyoruz.
const routes = fs.readdirSync(__dirname); // ile senkron olarak bulunduğumuz klasörün altındaki dosyaları okuyoruz.

for(let route of routes){
    if(route.includes(".js") && route != "index.js") {
        router.use("/"+route.replace(".js", ""), require("./"+route)); // burada routes klasöründeki dosyaları dinamik olarak routing yapısına ekliyoruz.
    }
}

module.exports = router;

// Böylece dinamik routes yapısı kullanarak routes klasöründeki dosyaları dinamik olarak routing yapısına ekliyoruz.
// app.jsde hepsini tek tek tanımlamak yerine routes klasöründeki dosyaları dinamik olarak routing yapısına eklemiş olduk.