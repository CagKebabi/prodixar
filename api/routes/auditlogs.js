const express = require('express');
const moment = require('moment'); // Tarih işlemlerini kolaylaştıran bir modül
const router = express.Router();
const Response = require('../lib/Response');
const AuditLogs = require('../db/models/AuditLogs');

// Normalde biz find({}) metodumuzda ({}) query parametresini hep boş bırakarak atıyorduk
// fakat auditlogs büyük bir veri kümesi olacağı için burada filtreleme işlemleriyle
// verileri sınırlayacağız. get i post metoduna çevirmemizin sebebi req body den 
// daha kolay veri alabilmek için.

router.post("/", async(req, res, next) => {
    try {
       let body = req.body;
       let query = {};
       let skip = body.skip;
       let limit = body.limit;

       if (typeof body.skip !== "numeric") {
        skip = 0;
       }
       if (typeof body.limit !== "numeric" || body.limit > 500) {
        limit = 500;
       }
       
       if (body.begin_date && body.end_date) {
          // Burada query.created_at alanının değeri body.begin_date ile gönderilmiş tarihten büyük veya eşitse
          // ve body.end_date ile gönderilen tarihten küçükse veya eşitse bu koşula uyan auditlogs
          // verilerini getirecektir.
          query.created_at = {
            $gte: moment(body.begin_date), // moment() ile verileri düzgün bir tarih formatına sokuyoruz 
            $lte: moment(body.end_date)
          }
       } else {
          query.created_at = {
            // Burada 1 gün öncesinden şimdiye kadar tüm verileri çek dememize yardımcı olacak olan filtrelemedir.
            $gte: moment().subtract(1, "day").startOf("day"), // moment() bize günümüze ait tarihi verir. moment().subtract(1, "day") ise son bir günü döner. moment().subtract(1, "day").startOf("day") ise günün başından 00:00:00 başlar.
            $lte: moment() 
          }
       }
       
       // queryden 500den fazla veri gelirse 500 ile sınırla dedik. Çünkü aynı günde çok fazla işlem yapılmış olabilir. 
       // skip in anlamıda biz bir pagination yapacağımız için 500 değerini aldıktan sonra fazlası varsa 500 daha ekler 500 daha ekleyerek verileri getirir. 
       // sort: {created_at: -1} ise created_at alanına göre tersten sıralamalı getir demektir böylece en son kaydedilen veri bize ilk başta gelir.
       let auditlogs = await AuditLogs.find(query).sort({created_at: -1}).skip(skip).limit(limit); 

       res.json(Response.successResponse(auditlogs));
    } catch (error) {
       let errorResponse = Response.errorResponse(error); 
       res.status(errorResponse.code).json(errorResponse);
    }
})

module.exports = router;

//req bize göderilen isteğin içinde bulunan body headerı ve diğer bilgileri barındırır
//res bizim reqe vereceğimiz cevabın fonksiyonlarını barındırır
//next eğer bu router.get() isteğini bir middleware oalrak kullanacaksak yani örneğin bir router.get()
// endpointi yazdık ve bu router.get() isteği tamamlandıktan sonra fonksiyonun en altına next
// yazarsak altında başka bir router.get() isteği varsa onu çalıştırmasını sağlarız.

// router.get("/", (req, res, next) => { 
//     //aşağıda req ile gelen bilgileri res ile kullanıcıya geri döndürdük
//     res.json({
//         body: req.body,
//         params: req.params,
//         query: req.query,
//         headers: req.headers
//     });
// })


// //Yukarıdan farklı olarak aşağıda açıklandığı gibi params ile olan endpoint kullanımı
// router.get("/:id", (req, res, next) => { 
//     //aşağıda req ile gelen bilgileri res ile kullanıcıya geri döndürdük
//     res.json({
//         body: req.body,
//         params: req.params,
//         query: req.query,
//         headers: req.headers
//     });
// })

// module.exports = router;
//app.jsde bu routerları import ediyoruz.

// Postmanda http://localhost:3000/auditlogs adresine GET isteği atarsak bize aşağıdaki sonucu verecektir
// {
//     "body": {},
//     "params": {},
//     "query": {},
//     "headers": {
//         "content-type": "application/json",
//         "user-agent": "PostmanRuntime/7.43.0",
//         "accept": "*/*",
//         "cache-control": "no-cache",
//         "postman-token": "d6525a3a-43ae-4e91-b892-dbe91b5068ff",
//         "host": "localhost:3000",
//         "accept-encoding": "gzip, deflate, br",
//         "connection": "keep-alive",
//         "content-length": "20"
//    }
// }

//Postmanda body kısmına tıklayıp raw ı seçip JSON formatını seçip aşağıdaki gibi body ile istek atarsak
//{
//    "id": 1234
//}
//Bize aşağıdaki gibi bir sonuç verir
// {
//     "body": {
//         "id": 1234
//     },
//     "headers": {
//         "content-type": "application/json",
//         "user-agent": "PostmanRuntime/7.43.0",
//         "accept": "*/*",
//         "cache-control": "no-cache",
//         "postman-token": "d6525a3a-43ae-4e91-b892-dbe91b5068ff",
//         "host": "localhost:3000",
//         "accept-encoding": "gzip, deflate, br",
//         "connection": "keep-alive",
//         "content-length": "20"
//     },
//     "params": {},
//     "query": {}
// }
// query alanı req atarken eklenen query string alanını temsil ediyor ve bunu json formatında bize veriyor.
// query string eklemek istediğimizde endpointimizin sonuna bir ? işareti ekliyoruz ve key ve value değerlerini = ile bağlıyoruz. Örneğin:

// http://localhost:3000/auditlogs?id=123

// Birtane daha fazla query string eklemek istiyorsak & ampersant işareti ile ekliyoruz. Örneğin:

// http://localhost:3000/auditlogs?id=123&name=Ahmet

// Bu şekilde bir istek attığımızda aşağıdaki gibi bir sonuç alırız

// {
//     "body": {
//         "id": 1234
//     },
//     "params": {},
//     "query": {
//         "id": "123",
//         "name": "Ahmet"
//     },
//     "headers": {
//         "content-type": "application/json",
//         "user-agent": "PostmanRuntime/7.43.0",
//         "accept": "*/*",
//         "cache-control": "no-cache",
//         "postman-token": "fc017db2-9053-4fed-ad22-ae958512a57d",
//         "host": "localhost:3000",
//         "accept-encoding": "gzip, deflate, br",
//         "connection": "keep-alive",
//         "content-length": "20"
//     }
// }

// params almak için ise kodumuzda biraz değişiklik yapmamız gerekir. endpointimiz içinden bir
// parametre alabiliriz. Yukarıdaki "/" endpointimizden farklı olarak endpointimize "/:id" eklediğmiiz zaman
// endpointimizin bir parametre alacağını söylemiş oluyoruz. paramsı endpointimize eklediğimiz zaman
// endpointimizin bir parametre alması gerektiğni belirtiyoruz. http://localhost:3000/auditlogs/
// ile istek attığımız zaman hata alırız çünkü "/:id" parametresi olmadan istek atamayız.
// Bunun için endpointimizin sonuna / dan sonra param değerini eklememiz gerekiyor.
// Örneğin: http://localhost:3000/auditlogs/123

// router.get("/:id", (req, res, next) => { 
//     //aşağıda req ile gelen bilgileri res ile kullanıcıya geri döndürdük
//     res.json({
//         body: req.body,
//         params: req.params,
//         query: req.query,
//         headers: req.headers
//     });
// })