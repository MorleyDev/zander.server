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
            if (!authorization || !authorization.scheme) {
                failure("No or Incorrect Authentication details provided");
            }
            else if (authorization.scheme != "Basic" || !authorization.basic) {
                failure("Unrecognised authorization scheme");
            }
            else
                failure( "No or Incorrect Authentication details provided");

        }
    }
}
