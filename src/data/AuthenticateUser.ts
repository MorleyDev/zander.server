/// <reference path="HashPassword.ts" />

var q = require('q');

module data
{
    export class AuthenticationResult {

        constructor(success: boolean, reason: string, username: string, userid: string) {
            this.success = success;
            this.reason = reason;
            this.username = username;
            this.userid = userid;
        }

        public success: boolean;
        public reason: string;
        public username: string;
        public userid: string;
    }

    export class AuthenticateUser
    {
        private _goduser;
        private _hashType;
        private _database;

        constructor(configuration, database) {
            this._goduser = configuration.goduser;
            this._hashType = configuration.hashAlgorithm;
            this._database = database;
        }

        authenticateGodUser(authorization) : AuthenticationResult {
            if (!authorization || !authorization.scheme)
                return new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined);
            if (authorization.scheme != "Basic" || !authorization.basic)
                return new AuthenticationResult(false, "Unrecognised authorization scheme", undefined, undefined);

            var username = authorization.basic.username;
            var password = authorization.basic.password;
            if (this._goduser && username && password && username == this._goduser.name && password == this._goduser.password)
                return new AuthenticationResult(true, undefined, username, "00000000-0000-0000-0000-000000000000");

            return new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined);
        }

        authenticateStandardUser(authorization) : any {

            var hashType = this._hashType;

            if (!authorization || !authorization.scheme) {
                console.log("authenticate failed: no authorization");
                return q.fcall(() => new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined));
            }
            else if (authorization.scheme != "Basic" || !authorization.basic) {
                console.log("authenticate failed: not basic authorization");
                return q.fcall(() => new AuthenticationResult(false, "Unrecognised authorization scheme", undefined, undefined));
            }
            else {
                var username = authorization.basic.username;
                var password = authorization.basic.password;
                return this._database.selectOne("Users", { username: username })
                    .then((user) => {
                        if (user) {
                            var hashedPassword = HashPassword(hashType, user.id, password);
                            if (user.password === hashedPassword)
                                return new AuthenticationResult(true, undefined, user.username, user.id);
                        }
                        return new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined);
                    }, (err) => {
                        return new AuthenticationResult(false, "No or Incorrect Authentication details provided", undefined, undefined);
                    });
            }
        }
    }
}
