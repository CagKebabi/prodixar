const express = require('express');
const router = express.Router();

const Roles = require('../db/models/Roles');
const RolePrivileges = require('../db/models/RolePrivileges');
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const Enum = require('../config/Enum');
const role_privileges = require('../config/role_privileges');

router.get("/", async (req, res) => {
    try {
        let roles = await Roles.find({})

        res.json(Response.successResponse(roles))
    } catch (err) {
        let errorResponse = Response.errorResponse(err.message);
        res.status(errorResponse.code).json(errorResponse);
    }
})

router.post("/add", async (req, res) => {
    let body = req.body;
    try {

        if (!body.role_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "role_name field must be filled");
        if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.length === 0) {
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "Validation Error!","permissions field must be an Array");
        }

        let role = new Roles({
            role_name: body.role_name,
            is_active: true,
            created_by: req.user?.id
        })

        await role.save();

        // Role e role priviliges ekle
        for (let i = 0; i < body.permissions.length; i++) {
            let priv = new RolePrivileges({
                role_id: role._id,
                permission: body.permissions[i],
                created_by: req.user?.id
            });

            await priv.save();
        }



        res.json(Response.successResponse({success: true}))
    } catch (err) {
        let errorResponse = Response.errorResponse(err.message);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post("/update", async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!", "_id field must be filled");
        
        let updates = {};

        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

        // Bir rolü güncellemek istediğimizde rolün yetkilerinide güncellemek isteyebiliriz.
        if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) {

            // Bu kontrol update etmek istediğimiz role ait tanımlı yetkiler var. Bu yetkilerin yeni gönderdiğimizyetkilerle
            // karşılaştırılması gerekiyor. Eğer var olan yetkiler varsa varolanları eleyeceğiz ve yeni yetkileri ekleyeceğiz.
            // Gödnerilen requestteki permissiondaolmayan ama dbde olanları silmemiz gerekiyor.
            let permissions = await RolePrivileges.find({role_id: body._id}); // Bu role ait tüm yetkileri alıyoruz.


            let removedPermissions = permissions.filter(x => !body.permissions.includes(x.permission)); // Burada veritabanında olan ama gönderilen requestin içinde olmayan yetkileri buluyoruz.
            // Yukarıdan farklı olarak newPermissions da verileri filterelerken map kullanmamızın sebebi removedPermissions verisi bize
            // ["category_view", "user_add"] gibi bir formatta gelirken newPermissions ise
            // [{role_id: "123", permission: "category_view", id: ""}] gibi bir formatta geliyor.
            let newPermissions = body.permissions.filter(x => !permissions.map(p => p.permission).includes(x)); // Burada gönderilen requestte olan ama veritabanında olmayan yetkileri buluyoruz.

            if (removedPermissions.length > 0) { //removedPermissions.length > 0 durumunda silinen veriler var demektir.
                // Burada _id değeri removedPermissions dizisindeki _id lerden biriyse bunu sil veritabanıdan.
                await RolePrivileges.deleteOne({_id: {$in: removedPermissions.map(x => x._id)}}) // $in birden fazla id ile sorgu yapmamızı sağlar.
            }

            if (newPermissions.length > 0) { // newPermissions.length > 0 durumunda yeni eklenen veriler var demektir.
                for (let i = 0; i < newPermissions.length; i++) {
                    let priv = new RolePrivileges({
                        role_id: body._id,
                        permission: newPermissions[i],
                        created_by: req.user?.id
                    });

                    await priv.save();
                }   
            }
        }

        await Roles.updateOne({_id: body._id}, updates);

        res.json(Response.successResponse({success: true}))
    } catch (err) {
        let errorResponse = Response.errorResponse(err.message);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Normalde role add ve update işlemlerinde Role Privileges ile ilgilide işlem yapıyorduk. Fakat delete işlemi için
// models klasörümüzdeki Roles.js dosyasında Roles classımızın içinde bu işlemi yaptık. Yani bir role silmek istediğimizde
// Role id si ile eşleşen role_privileges verisini silmesini istedik.
router.post("/delete", async (req, res) => {
    let body = req.body;
    try {

        if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST,"Validation Error!", "_id field must be filled");

        // Roles.deleteOne metodu kullanarak hem rolü hem de ilişkili role_privileges'ları siliyoruz
        await Roles.deleteOne({_id: body._id});

        res.json(Response.successResponse({success: true}))
    } catch (err) {
        let errorResponse = Response.errorResponse(err.message);
        res.status(errorResponse.code).json(errorResponse);
    }
});

// Bu endpointi yazmamızın sebebi tüm rol yetkilerini kolay yönetip aynı zamanda client tarafında da kolay erişilebilir hale getirmektir.
// Yani rolleri tanımlarken bu role privileges de rollerimizin sahip olduğu yetkileri tanımlamamıza yarayacaktır.
router.get("/role_privileges", async (req, res) => {
    res.json(role_privileges);
});

module.exports = router;