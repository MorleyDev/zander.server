module model {
    export class LoggedInUserDetails {
        constructor(username:string, authLevel:AuthenticationLevel, userId:string) {
            this.name = username;
            this.id = userId;
            this.authLevel = authLevel;
        }

        public name:string;
        public id:string;
        public authLevel:AuthenticationLevel;
    }
}
