module data
{
    export class AuthenticateUser
    {
        private _goduser;
        private _connection;

        constructor(configuration, connection) {
            this._goduser = configuration.goduser;
            this._connection = connection;
        }

        authenticateGodUser(authorization) {
            if (!authorization || !authorization.scheme) {
                throw "No or Incorrect Authentication details provided";
            }
            if (authorization.scheme != "Basic" || !authorization.basic) {
                throw "Unrecognised authorization scheme";
            }

            var username = authorization.basic.username;
            var password = authorization.basic.password;
            if (this._goduser && username && password) {
                if (username == this._goduser.name && password == this._goduser.password) {
                    return;
                }
            }
            throw "No or Incorrect Authentication details provided";
        }
    }
}
