/// <reference path='../../typings/node-uuid/node-uuid.d.ts'/>

var uuid : UUID = require("uuid");

module data {
    export class UserRepository {
        private _hashType;
        private _database;

        constructor(hashType, database) {
            this._hashType = hashType;
            this._database = database;
        }

        public createUser(username:string, email:string, password:string) : Q.IPromise<any> {
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

        public getUser(username) : Q.IPromise<any> {
            return this._database.selectOne("Users", { username: username });
        }

        public updateUser(id, email, password) : Q.IPromise<any> {
            return this._database.update("Users", { email: email }, { id: id })
                .then(() => {
                    return this._database.update("Users", { password: HashPassword(this._hashType, id, password) }, { id: id });
                });
        }

        public deleteUser(username) : Q.IPromise<any> {
            return this._database.delete("Users", { username: username });
        }
    }
}
