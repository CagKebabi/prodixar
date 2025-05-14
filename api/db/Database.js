// Bu dosya mongodb bağlantısını sağlayacak sınıfı tanımlıyor.

const mongose = require('mongoose'); //mongodb kütüphanesini import ettik. Bu kütüphane mongodb ile bağlantı kurmamızı sağlar.

class Database {
    constructor(instance) {
        if(!instance) {
            this.mongoConnection = null; //mongodb bağlantısını tutacak değişkeni tanımladık.
            instance = this;
        }

        return instance;
    }

    async connect(options) { 
        try {
            console.log("DB Connecting...");
            let db = await mongose.connect(options.CONNECTION_STRING)
    
            this.mongoConnection = db; //mongodb bağlantısını db değişkenine atadık.
            console.log("DB Connected.");
        } catch (err) {
            console.log("DB Connection Error: ", err);
            process.exit(1) //mongodb bağlantısı sağlanamazsa uygulamayı kapatıyoruz.
        }
    }
}

module.exports = Database;