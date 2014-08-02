/// <reference path='LoggedInUserDetails.ts'/>

module model {
    export class HttpRequest {
        public authorization:any;
        public headers:any;
        public parameters:any;
        public body:any;
        public log:any;

        public user:LoggedInUserDetails;
    }
}
