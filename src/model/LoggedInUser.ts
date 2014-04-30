module model {
     export class LoggedInUserDetails
     {
         username : string;
         userId : string;
         isSuper : boolean;

        constructor(username : string, isSuper : boolean, userId : string) {
            this.username = username;
            this.isSuper = isSuper;
            this.userId = userId;
        }
    }
}
