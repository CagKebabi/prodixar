const express = require('express');
const router = express.Router();

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


//Yukarıdan farklı olarak aşağıda açıklandığı gibi params ile olan endpoint kullanımı
router.get("/:id", (req, res, next) => { 
    //aşağıda req ile gelen bilgileri res ile kullanıcıya geri döndürdük
    res.json({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers
    });
})

module.exports = router;
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