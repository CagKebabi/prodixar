/* eslint-disable no-undef */
module.exports = {
    "PORT": process.env.PORT || 3000,
    "LOG_LEVEL:" : process.env.LOG_LEVEL || "debug",
    "CONNECTION_STRING" : process.env.CONNECTION_STRING || "mongodb://localhost:27017/prodixar",
    "JWT": {
        "SECRET": "123456",
        "EXPIRE_TIME": !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24 * 60 * 60 // 24 saat
    }
}

//CONNECTION_STRING adında bir field oluşturduk process.env.CONNECTION_STRING ile bir değişken tanımladık eğer 
//böyle bir değişken yoksa localhost:27017/prodixar değerini alacak. LOG_LEVEL adında bir field oluşturduk process.env.LOG_LEVEL ile bir değişken tanımladık eğer
//böyle bir değişken yoksa debug değerini alacak. Bu iki fieldı kullanarak uygulamanın log seviyesini ve veritabanı bağlantı stringini ayarlayabiliriz.
//Bu değişklenleri routesda index jsde kullanacağız. views klasöründeki indexjsde de kullandık. Böylece http://localhost:3000/ adresine girdiğimizde string olarak sayfada 
//{"LOG_LEVEL:":"debug","CONNECTION_STRING":"mongodb://localhost:27017/prodixar"} değerini görürüz. 
//Bu değişkenleri tanımlamadığımız için "debug" ve "mongodb://localhost:27017/prodixar" değerlerini alır.
//Bu değişkenleri process.env de tanımlamak istersek terminalde örneğin:
//$env:CONNECTION_STRING = "mongodb://127.0.0.1:27017/prodixar" yazarak CONNECTION_STRING adında yeni bir değişken env tanımlayabiliriz.
//Böylece app.js de console.log(process.env); yazarsak değişkenlerimiz arasında CONNECTION_STRING değişkenini görebiliriz.

//1-2 Değişken tanımlayacaksak bu yöntemle envlerimizi tanımlayabiliriz fakat proje gereksinimlerine göre belki onlarca değişken tanımlamamız gerekebilir.
//Buna bir çözüm olarak dotenv kütüphanesini kullanabiliriz. Bu kütüphane ile bir .env dosyası oluşturup bu dosyada değişkenlerimizi tanımlayabiliriz. Böylece kütüphane process.env ye değişkenlerimizi ekleyecektir.

//Bunu kullanmak iin app.jsde require('dotenv').config() yazarak dotenv kütüphanesini import etmemiz gerekiyor.

//Sırada .env dosyamızı oluşturmak var. api klasöründe .env adında bir dosya oluşturuyoruz ve içine değişkenlerimizi tanımlıyoruz.

//Burada dikkat etmemiz gereken öenmli bir nokta var. Normalde productiona çıkarken normalde bu envleri verebileceğimiz bir ortam üzerinden ıkıyoruz.
//örneğin docker gibi. Dolayısıyla bu projenin içine .env dosyasını dahil etmemiz çok doğru değil. Bu nedenle .env dosyasını gitignore a ekliyoruz ki bu dosya productiona çıkmasın.
//Projemizi githubda kullanmak isteyenler için .env.example adında bir dosya oluşturuyoruz ki projemizde gerekli olan envleri burada tanımlayalım ve projeyi kullanmak isteyenler kendi
//geliştirme ortamlarına göre bu envlerin parametrelerini girebilsin. Ayrıca .env dosyamızdaki değişkenleri docker yml dosyamızda tanımlayabileceğimiz için
//projemizde .env dosyasının bulunması sıkıntı olablilir. Bu nedenle app.jsde .env dosyasını import ederken bir koşul koyuyoruz:

// if(process.env.NODE_ENV !== 'production') 
//     require('dotenv').config(); //dotenv kütüphanesini import ettik ve config fonksiyonunu çağırdık. Bu fonksiyon .env dosyasını okuyarak process.env ye değişkenlerimizi ekleyecektir.

//NODE_ENV Parametresi express jsin bize sunduğu bir parametredir. Bu parametre ile uygulamanın hangi ortamda çalıştığını belirleyebiliriz.
//bu parametre iki değer alır default olarak default olarak development ve production değerlerini alabilir. Buradaki amaç express.js
//bu NODE_ENV yi okuyarak kendi log seviyesinin debug mı yoksa log mu olacağını belirler ve son kullanıcıya hata sayfalarının stack traceini gösterip göstermeyeceğini belirler.
//stack trace bir hata varsa ekranda hata ile ilgili bilgilerin gösterilmesidir. Bu nedenle NODE_ENV parametresini production olarak ayarladığımızda
//hata sayfalarının stack traceini göstermeyecek ve son kullanıcıya daha az bilgi verecektir buda güvenlikle ilgili bir önlemdir.

