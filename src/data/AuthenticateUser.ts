/// <reference path="HashPassword.ts" />

module data
{
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

        authenticateGodUser(authorization, success, failure) {
            if (!authorization || !authorization.scheme) {
                failure("No or Incorrect Authentication details provided");
                return;
            }
            if (authorization.scheme != "Basic" || !authorization.basic) {
                failure( "Unrecognised authorization scheme");
                return;
            }

            var username = authorization.basic.username;
            var password = authorization.basic.password;
            if (this._goduser
                && username
                && password
                && username == this._goduser.name
                && password == this._goduser.password) {
                success(username);
            }
            else
                failure("No or Incorrect Authentication details provided");
        }

        authenticateStandardUser(authorization, success, failure) {

            var hashType = this._hashType;
            if (!authorization || !authorization.scheme) {
                failure("No or Incorrect Authentication details provided");
            }
            else if (authorization.scheme != "Basic" || !authorization.basic) {
                failure("Unrecognised authorization scheme");
            }
            else {
                var username = authorization.basic.username;
                var password = authorization.basic.password;
                this._database.select("Users", { username: username }, function(err, user) {
                    if (err)
                        throw err;
                    else if (!user || user.length < 1) {
                        failure("No or Incorrect Authentication details provided");
                    } else {
                        var hashedPassword = HashPassword(hashType, user[0].id, password);
                        if (user[0].password == hashedPassword)
                            success(username);
                        else
                            failure("No or Incorrect Authentication details provided");
                    }
                });
            }
        }
    }
}
