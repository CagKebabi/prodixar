const logger = require("./logger");
let instance = null;

// Burada direk logger.info(log); gibi kullanamdan bir class oluşturarak bu şekilde 
// kullanmamızın sebebi mesela biz loglarımızı basarken kullanıcıların kişisel
// bilgilerini bu logların iinde basıyor olabiliriz. Bu sistemin adminleri bu
// kullanıcıların kişisel bilgilerine eriştiği zaman kvkk ile ilgili sorunlar yaşanabilir.
// Yani biz kullanıcıların kişisel bilgilerini kimseye göstermemeliyiz.
// Bu nedenle araya bir class oluşturduk Burada istersek createLogObject fonksiyonunda
// kullanmak için bir mask fonksiyonu oluşturabiliriz. ve log değerini maskeleyebiliriz.

class LoggerClass {
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    #createLogObject(email, location, proc_type, log) {
        return {
            email,
            location,
            proc_type,
            log
        }
    }

    info(email, location, proc_type, log) {
        let logs = this.#createLogObject("info", email, location, proc_type, log);
        logger.info(logs);
    }

    warn(email, location, proc_type, log) {
        let logs = this.#createLogObject("warn", email, location, proc_type, log);
        logger.warn(logs);
    }

    error(email, location, proc_type, log) {
        let logs = this.#createLogObject("error", email, location, proc_type, log);
        logger.error(logs);
    }

    verbose(email, location, proc_type, log) {
        let logs = this.#createLogObject("verbose", email, location, proc_type, log);
        logger.verbose(logs);
    }

    silly(email, location, proc_type, log) {
        let logs = this.#createLogObject("silly", email, location, proc_type, log);
        logger.silly(logs);
    }

    http(email, location, proc_type, log) {
        let logs = this.#createLogObject("http", email, location, proc_type, log);
        logger.http(logs);
    }

    debug(email, location, proc_type, log) {
        let logs = this.#createLogObject("debug", email, location, proc_type, log);
        logger.debug(logs);
    }
}

module.exports = new LoggerClass();
