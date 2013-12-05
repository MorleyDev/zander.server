module model {
    export enum HttpMethod {
        GET,
        HEAD,
        POST,
        PUT,
        DELETE,
        TRACE,
        OPTIONS,
        CONNECT,
        PATCH
    }

    export function HttpMethodToString(method: model.HttpMethod) : string {
        switch(method) {
            case HttpMethod.GET:
                return "get";
            case HttpMethod.HEAD:
                return "head";
            case HttpMethod.POST:
                return "post";
            case HttpMethod.PUT:
                return "put";
            case HttpMethod.DELETE:
                return "delete";
            case HttpMethod.TRACE:
                return "trace";
            case HttpMethod.OPTIONS:
                return "options";
            case HttpMethod.CONNECT:
                return "connect";
            case HttpMethod.PATCH:
                return "patch";
            default:
                return "get";
        }
    }

}

