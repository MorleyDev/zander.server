var uuid = require("uuid");
var crypto = require("crypto");

module data.user {
    export class CreateUserInDatabase {

        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        execute(username:string, email:string, password:string, callback) {
            try {
                var id = uuid.v1();
                var timestamp = Date.now();
                var userDto = {
                    id: id,
                    username: username,
                    email: email,
                    password: crypto.createHmac(this._hashType, id).update(password).digest("hex"),
                    timestamp: timestamp
                };
                this._database.insert("Users", userDto, function (err, insertId) {
                    callback(err);
                });
            } catch (e) {
                callback(e);
            }
        }
    }

    export class GetUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(username, callback) {
            this._database.selectOne("Users", { username: username }, function (err, row) {
                if (err) {
                    callback(null, err);
                } else {
                    callback(row, null);
                }
            });
        }
    }

    export class DeleteUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        execute(username, callback) {
            this._database.delete("Users", { username: username }, callback);
        }
    }

    export class UpdateUserInDatabase {
        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        execute(id, email, password, callback) {
            var hashedPassword = crypto.createHmac(this._hashType, id).update(password).digest("hex");

            var _database = this._database;
            _database.update("Users",
                { email: email },
                { id: id }, function(err) {
                    if (err)
                        callback(err);
                    else
                        _database.update("Users", { password: hashedPassword }, { id: id }, callback);
                });
        }
    }
}