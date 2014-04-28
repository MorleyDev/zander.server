module model {
     export class LoggedInUserDetails
     {
         username : string;
         isSuper : boolean;

        constructor(username : string, isSuper : boolean) {
            this.username = username;
            this.isSuper = isSuper;
        }
    }
}
