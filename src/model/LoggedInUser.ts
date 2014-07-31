module model {
    export enum AuthenticationLevel {
        None = 0,
        User = 1,
        Super = 2
    }

     export class LoggedInUserDetails {
         constructor(username : string, authLevel : AuthenticationLevel, userId : string) {
             this.username = username;
             this.userId = userId;
             this.authLevel = authLevel;
         }

         public username : string;
         public userId : string;
         public authLevel : AuthenticationLevel;
    }
}
