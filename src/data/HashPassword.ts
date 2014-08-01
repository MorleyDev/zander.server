var crypto = require("crypto");

module data {
    export function HashPassword(hashType : string, userId : string, password : string) : string {
        return crypto
            .createHmac(hashType, userId)
            .update(password)
            .digest("hex");
    }
}
