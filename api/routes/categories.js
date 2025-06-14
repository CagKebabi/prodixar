var express = require('express');
var router = express.Router();
// Categories modelimizi import ettik. İmport ettiğimizde models/Categories.js içindeki
// mongoose.Model ile bize sunduğu fonksiyonları kullanabiliyoruz.
const Categories = require('../db/models/Categories');
// Error handling için libs/Response.js dosyasını import ettik.
const Response = require('../lib/Response');
// Error handling için libs/Error.js dosyasını import ettik.
const CustomError = require('../lib/Error');
// ENUM'leri import ettik.
const Enum = require('../config/Enum');
// AuditLogs import ettik.
const AuditLogs = require('../lib/AuditLogs');
// Logger import ettik.
const logger = require('../lib/logger/LoggerClass');
const auth = require('../lib/auth')(); // auth kütüphanesini import ediyoruz. Bu kütüphane JWT ile kimlik doğrulama işlemlerini yapacak.

// const isAuthenticated = true;

// //Bütün istekleri kontrol ediyoruz. get post put delete gibi
// router.all("*", (req, res, next) => {
//     if(isAuthenticated){
//         next()
//     }else{
//         res.json({
//             message: "Unauthorized",
//             sucess: false,
//         })
//     }
// })

// /api/categories endpointi ile başlayan tüm endpoşintler için aşağıdaki middleware'ini kullanıyoruz.
// Aşağıdaki middleware, tüm isteklerde kimlik doğrulama işlemini yapacak.
// auth.authenticate() fonksiyonu, JWT token'ını kontrol edecek ve geçerli bir token varsa istekleri devam ettirecek.
// Yani artık kullanıcı giriş yapmadan categories endpointine erişemeyecek.
// auth endpointi ile giriş yaptıktan sonra res de gelen tokenı kopyalayıp Postman'de Authorization sekmesinden Bearer Token olarak yapıştırarak istek atabiliriz.
router.all("*",auth.authenticate(), (req, res, next) => {
   next()
})

// Listelemek için bir endpoint oluşturuyoruz.
router.get('/', async (req, res, next) => {

    try {
        // mongoose.Model in bize sunduğu find() fonksiyonunu kullanarak belirlediğimiz
        // bir query ile sorgu atmamızı sağlar. find() fonksiyonunun ilk parametresi
        // querydir. find({}) ile boş bir uery göndermiş oluruz.
        let categories = await Categories.find({});
        res.json(Response.successResponse(categories));
    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(Response.errorResponse(err));
    }
});

// Eklemek için bir endpoint oluşturuyoruz.
router.post("/add", async (req, res) => {
    let body = req.body;
    try {
        if (!body.name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "name field must be filled!");
    
        let category = new Categories({
            name: body.name,
            is_active: true,
            created_by: req.user?.id,
        });

        await category.save(); // mongoose.Model in bize sunduğu save() fonksiyonunu kullanarak oluşturduğumuz category nesnesini veritabanına kaydediyoruz.

        AuditLogs.info(req.user?.email, "Categories", "Category Add", category);
        logger.info(req.user?.email, "Categories", "Category Add", category);

        res.json(Response.successResponse({success: true}));

    } catch (err) {
        logger.error(req.user?.email, "Categories", "Category Add", err);
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

// Güncellemek için bir endpoint oluşturuyoruz.
router.post("/update", async (req, res) => {
    let body = req.body;

    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled!");

        let updates = {};

       if (body.name) updates.name = body.name; 
       if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

       // Burada _ id yi biz Categories modelinde tanımlamadaık bu _id değeri veritabanında görülebilir mongoose tarafından otomatik olarak oluşturuluyor.
       await Categories.updateOne({_id: body._id}, updates) //updateOne fonksiyonu ile güncelleme işlemi yapıyoruz. Aldığı parametre ise veritabanındaki hangi verinin güncelleneceğini belirten bir querydir.

       AuditLogs.info(req.user?.email, "Categories", "Category Update", {_id: body._id, ...updates});

       res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

// Silmek için bir endpoint oluşturuyoruz. (Normalde PUT DELETE gibi metodlarda kullanılabilir fakat post kullanmakta bir sakınca yoktur.)
router.post("/delete", async (req, res) => { 
    let body = req.body;

    try {
        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled!");

        await Categories.deleteOne({_id: body._id}); //deleteOne fonksiyonu ile silme işlemi yapıyoruz. Aldığı parametre ise veritabanındaki hangi verinin silineceğini belirten bir querydir.

        AuditLogs.info(req.user?.email, "Categories", "Category Delete", {_id: body._id});

        res.json(Response.successResponse({success: true}));

    } catch (err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
})

module.exports = router;