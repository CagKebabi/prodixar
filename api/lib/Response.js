const Enum = require("../config/Enum");
const CustomError = require("./Error");

class Response {
    constructor() {}

    // static in anlamı new anahtar kelimesi ile sınıfın bir örneğini oluşturmadan erişim sağlamak için kullanılır.
    // yani böylece Response.successResponse() şeklinde erişim sağlanabilir.
    static successResponse(data, code = 200) { // 200 HTTP status kodu
        // 200 kodu başarılı bir isteği temsil eder. metodu kullanırken 
        // code u belirtmediğimiz sürece bu değer 200 olarak kalır.
        return {
            code,
            data
        }
    }

    static errorResponse (error) {
        console.error(error);
        if (error instanceof CustomError) {
            // CustomError sınıfından bir hata fırlatıldıysa
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description,
                }
            }
        }
        return {
            code: Enum.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error: {
                message: "Unknown Error!",
                description: error.message,
            }
        }
    }
}

module.exports = Response;