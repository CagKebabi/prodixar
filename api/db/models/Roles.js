const mongoose = require('mongoose');
const RolePrivileges = require('./RolePrivileges');

const schema = mongoose.Schema({
    role_name: {type: String, required: true, unique: true}, //Burada role_name fieldımız zorunlu kıldık yani role_name değeri olmadan bu şemaya kayıt yapılamaz. unique: true dememizin sebebi ise bu fieldın benzersiz olması gerektiğidir. Yani aynı role_name değeri ile birden fazla kayıt yapılamaz.
    is_active: {type: Boolean, default: true}, //Bu fieldımız zorunlu değil default olarak true değerini alır
    //Burada created_by fieldimiz önemli Users tablosundan bir değer gelecek
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        //required: true, // bu field zorunlu kıldık yani created_by değeri olmadan bu şemaya kayıt yapılamaz
    }
}, {
    versionKey: false, //Mongoose kütüphanesinin otomatik olarak her tablonun her fieldinde versionKey adında bir field oluşturmasını istemiyoruz. Bu field her tablonun her fieldında otomatik olarak oluşturuluyor. Bu fieldın amacı veritabanındaki verilerin versiyonunu tutmaktır. Bu nedenle bu fieldı false yapıyoruz.
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// Bu Roles classını tanımlama sebebimiz bir işlem yaparken öncesinde bir kontrol koyabilmemizi sağlamasıydı.
// Burada bir rolü silerken öncesinde kendisinse ait olan role_priviligesları silmesini isteyeceğiz. Ardından
// bu rolü sileceğiz. Bu işlemi yapabilmek için Roles classını kullanacağız.
class Roles extends mongoose.Model {

    static async deleteOne(query) {

        if(query._id) {
            // Delete all role privileges associated with this role_id
            await RolePrivileges.deleteMany({role_id: query._id})
        }

        // super mongoose.Model den geliyor
        return await super.deleteOne(query);
    }

}

schema.loadClass(Roles)

module.exports = mongoose.model('roles', schema); 