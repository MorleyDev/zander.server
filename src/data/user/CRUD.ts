/// <reference path="../HashPassword.ts" />

var uuid = require("uuid");

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
                    password: HashPassword(this._hashType, id, password),
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
            this._database.select("Users", { username: username }, function (err, row) {
                if (err) {
                    callback(null, err);
                } else {
                    if (row && row.length > 0)
                        callback(row[0], null);
                    else
                        callback(null, null);
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
            var hashedPassword = HashPassword(this._hashType, id, password);

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
