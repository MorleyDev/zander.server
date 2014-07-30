/// <reference path="../HashPassword.ts" />
/// <reference path="../../../typings/uuid/UUID.d.ts" />

var uuid = require("uuid");

module data.user {
    export class CreateUserInDatabase {

        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        run(username:string, email:string, password:string) {
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

        execute(username:string, email:string, password:string, callback) {
            this.run(username, email, password)
                .then((insertId) => { callback(undefined); }, (err) => { callback(err); });
        }
    }

    export class GetUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        run(username) : any {
            return this._database.selectOne("Users", { username: username });
        }

        execute(username, callback) {
            this.run(username)
                .then((user) => {
                    callback(null, user);
                }, (err) => {
                    callback(err, null);
                });
        }
    }

    export class DeleteUserFromDatabase {
        private _database;

        constructor(database) {
            this._database = database;
        }

        run(username) {
            return this._database.delete("Users", { username: username });
        }

        execute(username, callback) {
            this.run(username).then(() => {
                    callback(undefined);
                }, (err) => {
                    callback(err);
                });
        }
    }

    export class UpdateUserInDatabase {
        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        run(id, email, password) {
            return this._database.update("Users", { email: email }, { id: id })
                .then(() => {
                    return this._database.update("Users", { password: HashPassword(this._hashType, id, password) }, { id: id });
                });
        }

        execute(id, email, password, callback) {
            this.run(id,email,password)
                .then(() => {
                    callback(undefined);
                }, (err) => {
                    callback(err);
                });
        }
    }
}
