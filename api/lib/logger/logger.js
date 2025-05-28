// winston kütüphanesini import ediyoruz.
// Destructuring assignment ile format, createLogger, transports fonksiyonlarını import ediyoruz.
// const winston = require("winston"); olarak import edip sonra winston.format, winston.createLogger, winston.transports kullanabilirdik.
// Bunun yerine Destructuring assignment ile sadece kullanacağımız fonksiyonları import ediyoruz.
const {format, createLogger, transports} = require("winston"); //Destructuring assignment

const { LOG_LEVEL } = require("../../config");

const formats = format.combine( // format.combine tüm formatları birleştiriyor.
    format.timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}), // format.timestamp ile tarih formatını belirliyoruz.
    format.simple(), // format.simple ile basit bir format oluşturuyoruz.
    format.splat(), // format.splat ile splat formatını kaydetiyoruz.
    // format.printf ile log mesajını formatlıyoruz.
    format.printf(
        (info) => `${info.timestamp} ${info.level.toUpperCase()}: [email: ${info.message.email}] [location: ${info.message.location}] [proc_type: ${info.message.proc_type}] [log: ${info.message.log}]`
    )
)

const logger = createLogger({
    level: LOG_LEVEL, // Hangi LEVELA KADAR LOG BASILACAĞININ BİLGİSİ
    transports: [
        new (transports.Console)({format:formats})
    ]
})

module.exports = logger;

// Bu işlemler ile log mesajını formatlıyoruz böylece log mesajını daha okunaklı hale getiriyoruz.
// Aşağıdaki örnek gibi.
// [2025-05-04 12:12:12] INFO: [email:asd] [location:abc] [proc_type:abc] [log:{}]