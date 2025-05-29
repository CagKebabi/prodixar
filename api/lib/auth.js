const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const Users = require('../db/models/Users'); // Kullanıcı modelini import ediyoruz.
const UserRoles = require('../db/models/UserRoles'); // Kullanıcı rolleri modelini import ediyoruz.
const RolePrivileges = require('../db/models/RolePrivileges');

const config = require('../config');

module.exports = function () {
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET, // Burada secreti verdiğimiz için
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT'yi requestten alıyoruz. Bearer token olarak alıyoruz. Yani Authorization headerında Bearer token olarak gönderiyoruz.
    }, async (payload, done) => { // bu kısım JWT nin payloadu bu kısmı bize passpart kütüphanesi veriyor.
        try {
            // KUllnıcıyı kontrol ettiğmiiz kısım yani aldığımız bilgilerle kullanıcı var mı yok mu kontrol ediyoruz.
            let user = await Users.findOne({_id: payload._id}); // payloaddan id yi alıyoruz ve kullanıcıyı bulmaya çalışıyoruz.

            if (user) {
            // User var ise rollerrini alıyoruz.
            let userRoles = await UserRoles.find({user_id: payload._id}); // Kullanıcının rollerini alıyoruz.

            // Kullanıcının rollerine göre yetkilerini alıyoruz.
            let rolePrivileges = await RolePrivileges.find({
                role_id: {$in: userRoles.map(role => role.role_id)} // Kullanıcının rollerine göre yetkileri alıyoruz. userRoles un içini gez ve sadece role_id leri al.
            });

            // Kullanıcının varolduğunu belirtiyoruz.
            // ilk parametre hata, ikinci parametre kullanıcı bilgisi. İlk parametre null, çünkü hata yok. İkinci parametre olarak kullanıcı 
            // bilgilerini veriyoruz yani payloadın jwt nin alacağı değerler. Fakat burada çok hassas bir bilgi vermemeliyiz.
            // Örneğin kullanıcı şifresini vermemeliyiz. Çünkü bu bilgiler JWT token içinde saklanacak ve bu tokeni alan herkes bu bilgilere erişebilecek.
            done(null, {
                    id: user._id,
                    roles: rolePrivileges,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME, // JWT'nin ne zaman süresinin dolacağını belirtiyoruz. config dosyasındaki EXPIRE_TIME değerini kullanıyoruz.
            }) 

            } else {
                done(new Error("User not found"), null); // Eğer kullanıcı bulunamazsa done fonksiyonuna null ve false değerlerini gönderiyoruz. Bu durumda kullanıcı doğrulanmamış olacak.
            }
        } catch (err){
            done(err, null); // Eğer bir hata oluşursa done fonksiyonuna hatayı ve null kullanıcı bilgisini gönderiyoruz.
        }

    });

    // Passport'a stratejiyi ekliyoruz.
    passport.use(strategy);
    
    return {
        initialize: () => {
            return passport.initialize(); // Passport'u başlatıyoruz.
        },
        authenticate: () => {
            return passport.authenticate('jwt', {session: false}); // JWT ile kimlik doğrulama yapıyoruz. session: false ile oturum yönetimini devre dışı bırakıyoruz.
        } 
    }

}