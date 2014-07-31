module model {
     export class LoggedInUserDetails {
         constructor(username : string, isSuper : boolean, userId : string) {
             this.username = username;
             this.isSuper = isSuper;
             this.userId = userId;
         }

         public username : string;
         public userId : string;
         public isSuper : boolean;
    }
}
