/// <reference path="HttpMethod.ts" />

module model {
    export class HttpRequest {

        public method : HttpMethod;
        public headers;
        public parameters;
        public body;
    }
}
