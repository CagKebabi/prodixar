const mongoose = require('mongoose');

//Şema adında bir değişken tanımladık. Bu değişken mongoose kütüphanesinin Schema fonksiyonunu kullanarak bir şema oluşturuyoruz.
//Burada ise tablolarımızın fieldlarını tanımlıyoruz.
const schema = mongoose.Schema({
    email: String,
    passwoed: String,
    is_active: Boolean,
    first_name: String,
    last_name: String,
    phone_number: String,

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
    constructor() {
        super('Users', schema); //super ile mongoose.Model sınıfının constructorını çağırıyoruz. Bu sınıfın ilk parametresi modelin adıdır. İkincisi ise şemadır.
    }
}