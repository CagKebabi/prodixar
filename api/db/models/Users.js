const mongoose = require('mongoose');

//Şema adında bir değişken tanımladık. Bu değişken mongoose kütüphanesinin Schema fonksiyonunu kullanarak bir şema oluşturuyoruz.
//Burada ise tablolarımızın fieldlarını tanımlıyoruz.
const schema = mongoose.Schema({
    email: {type: String, required: true}, //Burada email fieldımız zorunlu kıldık yani email değeri olmadan bu şemaya kayıt yapılamaz
    password: {type: String, required: true}, 
    is_active: {type: Boolean, default: true}, //Bu fieldımız zorunlu değil default olarak true değerini alır
    first_name: String,
    last_name: String,
    phone_number: String,
    // email: String,
    // password: String,
    // is_active: Boolean,
    // first_name: String,
    // last_name: String,
    // phone_number: String,

}, {
    //Alttaki gibi yazmak yerine  timestamps: true yazarsak otomatik olarak createdAt ve updatedAt fieldları oluşturur.
    //fakat biz diğer fieldlarımızda _ kullandıpğımız için bu şekilde tanımladık. phone_number gibi created_at olmasını istediğimiz için.

    timesstamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//Users ismiyle bir class oluşturuyoruz. Users tablamouzun adıdır. Bu tabloyu mongoose.Model den extend ediyoruz.
//Bu işlem oop ye göre bir classtan farklı classlar üretiyoruz.
class Users extends mongoose.Model {
    
}

//classımızı schema ile birleştiriyoruz. Bu işlem ile classımızı mongoose kütüphanesine tanıtıyoruz.
schema.loadClass(Users)
// Farklı yerlerde kullanabilmek için classımızı export ediyoruz.
module.exports = mongoose.model('users', schema); //ilk parametre modelin adıdır. İkincisi ise şemadır. Bu işlem ile classımızı mongoose kütüphanesine tanıtıyoruz.

//models klasörü altında tüm şemalarımızı oluşturduktan sonra bin/www de veritabanımızı import ediyoruz