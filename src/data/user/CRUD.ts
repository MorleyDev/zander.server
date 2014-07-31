/// <reference path="../HashPassword.ts" />
/// <reference path="../../../typings/node-uuid/node-uuid.d.ts" />
/// <reference path="../../../typings/Q/Q.d.ts" />
var uuid : UUID = require("uuid");


module data.user {
    export class CreateUserInDatabase {

        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        run(username:string, email:string, password:string) : Q.IPromise<any> {
            var id = uuid.v1();
            var userDto = {
                id: id,
                username: username,
                email: email,
                password: HashPassword(this._hashType, id, password),
                timestamp: Date.now()
            };
            return this._database.insert("Users", userDto);
        }
    }

    export class GetUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        run(username) : Q.IPromise<any> {
            return this._database.selectOne("Users", { username: username });
        }
    }

    export class DeleteUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        run(username) : Q.IPromise<any> {
            return this._database.delete("Users", { username: username });
        }
    }

    export class UpdateUserInDatabase {
        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        run(id, email, password) : Q.IPromise<any> {
            return this._database.update("Users", { email: email }, { id: id })
                .then(() => {
                    return this._database.update("Users", { password: HashPassword(this._hashType, id, password) }, { id: id });
                });
        }
    }
}
