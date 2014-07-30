var crypto = require("crypto");

module data
{
    export function HashPassword(hashType, id, password) {
        return crypto.createHmac(hashType, id)
                     .update(password)
                     .digest("hex");
    }
}
