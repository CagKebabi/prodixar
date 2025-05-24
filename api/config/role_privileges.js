// Burası roller için izinlerin tanımlandığı dosyadır.

module.exports = {
    privGroups: [
        {
            id: "USERS",
            name: "User Permissions"
        },
        {
            id: "ROLES",
            name: "Role Permissions"
        },
        {
            id: "CATEGORIES",
            name: "Category Permissions"
        },
        {
            id: "AUDITLOGS",
            name: "AuditLogs Permissions"
        }
    ],

    privileges: [
        {
            key: "user_view", // Vereceğimiz izinlerin anahtar kelimesi
            name: "User View", 
            group: "USERS", // Bu izin hangi gruba ait
            description: "User view" // Bu izin ne işe yarar
        },
        {
            key: "user_add", // Vereceğimiz izinlerin anahtar kelimesi
            name: "User ADD", 
            group: "USERS", // Bu izin hangi gruba ait
            description: "User add" // Bu izin ne işe yarar
        },
        {
            key: "user_update", // Vereceğimiz izinlerin anahtar kelimesi
            name: "User Update", 
            group: "USERS", // Bu izin hangi gruba ait
            description: "User update" // Bu izin ne işe yarar
        },
        {
            key: "user_delete", // Vereceğimiz izinlerin anahtar kelimesi
            name: "User Delete", 
            group: "USERS", // Bu izin hangi gruba ait
            description: "User delete" // Bu izin ne işe yarar
        },
        {
            key: "role_view", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Role View", 
            group: "ROLES", // Bu izin hangi gruba ait
            description: "Role view" // Bu izin ne işe yarar
        },
        {
            key: "role_add", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Role ADD", 
            group: "ROLES", // Bu izin hangi gruba ait
            description: "Role add" // Bu izin ne işe yarar
        },
        {
            key: "role_update", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Role Update", 
            group: "ROLES", // Bu izin hangi gruba ait
            description: "Role update" // Bu izin ne işe yarar
        },
        {
            key: "role_delete", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Role Delete", 
            group: "ROLES", // Bu izin hangi gruba ait
            description: "Role delete" // Bu izin ne işe yarar
        },
        {
            key: "category_view", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Category View", 
            group: "CATEGORIES", // Bu izin hangi gruba ait
            description: "Category view" // Bu izin ne işe yarar
        },
        {
            key: "category_add", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Category ADD", 
            group: "CATEGORIES", // Bu izin hangi gruba ait
            description: "Category add" // Bu izin ne işe yarar
        },
        {
            key: "category_update", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Category Update", 
            group: "CATEGORIES", // Bu izin hangi gruba ait
            description: "Category update" // Bu izin ne işe yarar
        },
        {
            key: "category_delete", // Vereceğimiz izinlerin anahtar kelimesi
            name: "Category Delete", 
            group: "CATEGORIES", // Bu izin hangi gruba ait
            description: "Category delete" // Bu izin ne işe yarar
        },
        {
            key: "auditlogs_view", // Vereceğimiz izinlerin anahtar kelimesi
            name: "AuditLogs View", 
            group: "AUDITLOGS", // Bu izin hangi gruba ait
            description: "AuditLogs view" // Bu izin ne işe yarar
        }
    ]
}