const mongoose = require('mongoose');

const schema = mongoose.Schema({
    role_name: {type: String, required: true}, //Burada role_name fieldımız zorunlu kıldık yani role_name değeri olmadan bu şemaya kayıt yapılamaz
    is_active: {type: Boolean, default: true}, //Bu fieldımız zorunlu değil default olarak true değerini alır
    //Burada created_by fieldimiz önemli Users tablosundan bir değer gelecek
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true, // bu field zorunlu kıldık yani created_by değeri olmadan bu şemaya kayıt yapılamaz
    }
}, {
    versionKey: false, //Mongoose kütüphanesinin otomatik olarak her tablonun her fieldinde versionKey adında bir field oluşturmasını istemiyoruz. Bu field her tablonun her fieldında otomatik olarak oluşturuluyor. Bu fieldın amacı veritabanındaki verilerin versiyonunu tutmaktır. Bu nedenle bu fieldı false yapıyoruz.
    timesstamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

class Users extends mongoose.Model {

}

schema.loadClass(Users)

module.exports = mongoose.model('users', schema); 