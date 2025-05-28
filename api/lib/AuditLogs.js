const Enum = require('../config/Enum');
const AuditLogsModel = require('../db/models/AuditLogs');

// Bu classın amacı veritabanına log kaydetmek için kullanılır.
// Mesela category lerden bir kategori silip eklediğimizde bunu kaydediyoruz.
// http://localhost:3000/api/auditlogs endpointi ilede bu logları görüntüleyebiliriz.

let instance = null;
 class AuditLogs {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    info (email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.INFO, 
            email, location, proc_type, log
        })
    }

    warn (email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.WARN, 
            email, location, proc_type, log
        })
    }

    error (email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.ERROR, 
            email, location, proc_type, log
        })
    }

    debug (email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.DEBUG, 
            email, location, proc_type, log
        })
    }
    
    // Burada veritabanına kim işlem yaptı nerde yaptı ne yaptı ve aıklaması şeklinde verileri kaydedeceğiz 
    
    // Ayrıca işlemi awaitle yapmamamızın sebebi her log basmada veritabanına kaydetme işelmini yaparken
    // uygulama beklemek zorunda kalacak ve buda sistemi yavaşlatacak.

    // saveToDB ni başına # eklememizin sebebi bu fonksiyonu dışarıdan erişilemez hale getirmek.
    // Böylece bu fonksiyonu sadece AuditLogs classı içinde kullanabiliriz.
    #saveToDB({level, email, location, proc_type, log}) {
        AuditLogsModel.create({
            level,
            email,
            location,
            proc_type,
            log
        })
    }
}

module.exports = new AuditLogs();

