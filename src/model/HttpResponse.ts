module model {
    export class HttpResponse {
        constructor(statusCode : number, content : any) {
            this.statusCode = statusCode;
            this.content = content;
        }

        public statusCode : number;
        public content : any;
    }
}

