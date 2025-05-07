// Bu dosya mongodb bağlantısını sağlayacak sınıfı tanımlıyor.

const mongose = require('mongoose'); //mongodb kütüphanesini import ettik. Bu kütüphane mongodb ile bağlantı kurmamızı sağlar.

class Database {
    constructor() {
        if(!instance) {
            this.mongoConnection = null; //mongodb bağlantısını tutacak değişkeni tanımladık.
            instance = this;
        }

        return instance;
    }

    async connect(options) { 
        let db = await mongose.connect(options.CONNECTION_STRING)

        this.mongoConnection = db; //mongodb bağlantısını db değişkenine atadık.
    }
}

module.exports = Database;