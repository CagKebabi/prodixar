var express = require('express');
const bcrypt = require('bcrypt'); // Kullanıcı kayıt işlemlerinde şifreleme için bcrypt kütüphanesini kullanıyoruz. Böylece kullanıcı şifrelerini güvenli bir şekilde saklayabiliriz.
const jwt = require('jwt-simple')
const is = require('is_js');

const Users = require('../db/models/Users');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const UserRoles = require('../db/models/UserRoles');
const Roles = require('../db/models/Roles'); // Kullanıcı rolleri için Roles modelini import ediyoruz. Bu model, kullanıcıların rollerini yönetmek için kullanılır.
var router = express.Router();
const config = require('../config'); // Config dosyasını import ediyoruz. Bu dosya, uygulamanın yapılandırma ayarlarını içerir.
const auth = require('../lib/auth')(); // auth kütüphanesini import ediyoruz. Bu kütüphane JWT ile kimlik doğrulama işlemlerini yapacak.

router.post("/register", async(req, res, next) => {
  let body = req.body;
  try {
    let user = await Users.findOne({}) // Burada bir kullanıcı oluştumu diye kontrol ediyoruz.

    if (user) {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND)
    }

    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "email fields must be filled");

    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "password fields must be filled");

    if (body.password.length < Enum.PASS_LENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", `password must be at least ${Enum.PASS_LENGTH} characters long`);

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); 

    let createdUser = await Users.create({
      email: body.email,
      password: password,
      is_active: true, 
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    })

    let role = await Roles.create({
      role_name: Enum.SUPER_ADMIN,
      is_active: true,
      created_by: createdUser._id
    })

    await UserRoles.create({
      role_id: role._id, 
      user_id: createdUser._id 
    })

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({success: true}, Enum.HTTP_CODES.CREATED));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/auth", async (req, res, next) => {
  try {
    let {email, password} = req.body;

    Users.validateFieldsBeforeAuth(email, password); // Kullanıcıdan gelen email ve password alanlarını kontrol ediyoruz. Eğer geçerli değilse hata fırlatıyoruz.
  
    let user = await Users.findOne({email}); // Kullanıcıyı email ile bulmaya çalışıyoruz.

    if (!user) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Validation Error!", "Email or password is not valid");

    // DB den gelen kullanıcının hashli şifresini kontrol ediyoruz. Eğer kullanıcı bulunamazsa veya şifreler eşleşmezse hata fırlatıyoruz.
    // Kullanıcının şifresini kontrol ediyoruz. 
    if (!user.validPassword(password)) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "Validation Error!", "Email or password is not valid");

    // JWT Token oluşturma
    let payload = {
      _id: user._id,
      exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME // Tokenin ne zaman süresinin dolacağını belirtiyoruz. config dosyasındaki EXPIRE_TIME değerini kullanıyoruz.
    };

    let token = jwt.encode(payload, config.JWT.SECRET); // JWT Token oluşturuyoruz. payload ve secret key ile tokeni encode ediyoruz.

    let userData = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    
    res.json(Response.successResponse({token, user: userData}))

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
})

// Diğer endpointlerden farklı olarak tüm endpointlerin en başına değilde /register ve /auth endpointlerinden sonra koymamızın nedeni.
// /auth ve /register endpointlerinde kimlik doğrulama işlemine gerek olmamasıdır.

// /api/categories endpointi ile başlayan tüm endpoşintler için aşağıdaki middleware'ini kullanıyoruz.
// Aşağıdaki middleware, tüm isteklerde kimlik doğrulama işlemini yapacak.
// auth.authenticate() fonksiyonu, JWT token'ını kontrol edecek ve geçerli bir token varsa istekleri devam ettirecek.
// Yani artık kullanıcı giriş yapmadan categories endpointine erişemeyecek.
// auth endpointi ile giriş yaptıktan sonra res de gelen tokenı kopyalayıp Postman'de Authorization sekmesinden Bearer Token olarak yapıştırarak istek atabiliriz.
router.all("*",auth.authenticate(), (req, res, next) => {
   next()
})

/* GET users listing. */
router.get('/', async(req, res, next) => {
  try {
    let users = await Users.find({})

    res.json(Response.successResponse(users));
  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/add", async(req, res, next) => {
  let body = req.body;
  try {
    // Burada istersek email ve password alanları için büyük harf küçük harf kontrollerinide yazabiliriz. Fakat Client tarafında ben bu kontorolleri yapacağım.
    if (!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "email fields must be filled");
    if (!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "password fields must be filled");

    if (body.password.length < Enum.PASS_LENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", `password must be at least ${Enum.PASS_LENGTH} characters long`);

    // Burada roller alanının dolu olup olmadığını ve bir dizi olup olmadığını kontrol ediyoruz. Eğer boşsa veya dizi değilse hata fırlatacağız.
    if (!body.roles || !Array.isArray(body.roles) || body.roles.length === 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "roles field must be an Array and cannot be empty");
    }

    let roles = await Roles.find({_id: {$in: body.roles}}); // Burada gelen rollerin veritabanında olup olmadığını kontrol ediyoruz. Eğer yoksa hata fırlatacağız.

    if (roles.length == 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "roles field must be an Array and cannot be empty");
    }

    // Şifreleme işlemi için bcrypt kütüphanesini kullanıyoruz. hashing ve saulting ile password datasını iki kez karıştırıyoruz
    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); // 8, bcrypt'in saulting için kullandığı rounds sayısıdır. Bu sayı arttıkça şifreleme daha güvenli hale gelir fakat işlem süresi de artar.

    // Burada save metodunun dışında create metodunu da kullanabiliriz. Böylece nesne tanımlamadan direkt olarak veritabanına kayıt yapabiliriz.
    let user = await Users.create({
      email: body.email,
      password: password,
      is_active: body.is_active || true, // Eğer is_active alanı gelmezse varsayılan olarak true değerini alır.
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number
    })

    // Kullanıcıyı kaydettikten sonra rollerini de kullanıcıya ekliyoruz.
    for (let i = 0; i < roles.length; i++) {
      await UserRoles.create({
        role_id: roles[i]._id, // Rolün id'sini alıyoruz.
        user_id: user._id // Kullanıcının id'sini alıyoruz. Bu id, kullanıcı kaydı yapıldıktan sonra veritabanından alınabilir.
      });
    }

    // Biz normalde başarılı işlemlerde 200 kodu dönüyorduk fakat normalde yeni bir kayıt oluşturduğumuz için 201 kodunu dönmemiz daha iyi olur.
    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse({success: true}, Enum.HTTP_CODES.CREATED));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/update", async(req, res, next) => {
  let body = req.body;
  try {
    let updates = {};

    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    if (!body.password && !body.password.length < Enum.PASS_LENGTH) {
      updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
    }

    if (typeof body.is_active === 'boolean') updates.is_active = body.is_active;
    if (body.first_name) updates.first_name = body.first_name;
    if (body.last_name) updates.last_name = body.last_name;
    if (body.phone_number) updates.phone_number = body.phone_number;

    if (Array.isArray(body.roles) && body.roles.length > 0) {
      let userRoles = await UserRoles.find({user_id: body._id}); // Kullanıcının rollerini alıyoruz.

      let removedRoles = userRoles.filter(x => !body.roles.includes(x.role_id.toString())); 
      let newRoles = body.roles.filter(x => !userRoles.map(r => r.role_id).includes(x));

      if (removedRoles.length > 0) { //removedPermissions.length > 0 durumunda silinen veriler var demektir.
          // Burada _id değeri removedPermissions dizisindeki _id lerden biriyse bunu sil veritabanıdan.
          await UserRoles.deleteMany({_id: {$in: removedRoles.map(x => x._id.toString())}}) // $in birden fazla id ile sorgu yapmamızı sağlar.
      }

      if (newRoles.length > 0) { // newPermissions.length > 0 durumunda yeni eklenen veriler var demektir.
          for (let i = 0; i < newRoles.length; i++) {
              let userRole = new UserRoles({
                  role_id: newRoles[i],
                  user_id: body._id,
              });

              await userRole.save();
          }   
      }
    }

    await Users.updateOne ({_id: body._id}, updates);

    res.json(Response.successResponse({success: true}));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

router.post("/delete", async(req, res, next) => {
  let body = req.body;
  try {
    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!", "_id field must be filled");

    await Users.deleteOne({_id: body._id});

    await UserRoles.deleteMany({user_id: body._id}); // Kullanıcıya ait rolleride siliniyor.

    res.json(Response.successResponse({success: true}));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports = router;
