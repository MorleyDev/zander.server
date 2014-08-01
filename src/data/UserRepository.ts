/// <reference path='../../typings/node-uuid/node-uuid.d.ts' />
/// <reference path='../model/db/User.ts' />


module data {
    var uuid : UUID = require("uuid");

    export class UserRepository {
        private _hashType : string;
        private _database : any;

        constructor(hashType : string, database : any) {
            this._hashType = hashType;
            this._database = database;
        }

        public createUser(username:string, email:string, password:string) : Q.IPromise<model.db.User> {
            var id = uuid.v1();
            var userDto = {
                id: id,
                username: username,
                email: email,
                password: HashPassword(this._hashType, id, password),
                timestamp: Date.now()
            };
            return this._database.insert("Users", userDto).then((rowId : any) => { return userDto; });
        }

        public getUser(username : string) : Q.IPromise<model.db.User> {
            return this._database.selectOne("Users", { username: username });
        }

        public updateUser(id : string, email : string, password : string) : Q.IPromise<void> {
            return this._database.update("Users", { email: email }, { id: id })
                .then(() => {
                    return this._database.update("Users", { password: HashPassword(this._hashType, id, password) }, { id: id });
                });
        }

        public deleteUser(username : string) : Q.IPromise<void> {
            return this._database.delete("Users", { username: username });
        }
    }
}
