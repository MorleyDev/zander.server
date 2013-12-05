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

    export function StringToHttpMethod(method: string) : model.HttpMethod {
        switch(method.toLowerCase()) {
            case "get":
                return HttpMethod.GET;
            case "head":
                return HttpMethod.HEAD;
            case "post":
                return HttpMethod.POST;
            case "put":
                return HttpMethod.PUT;
            case "delete":
                return HttpMethod.DELETE;
            case "trace":
                return HttpMethod.TRACE;
            case "options":
                return HttpMethod.OPTIONS;
            case "connect":
                return HttpMethod.CONNECT;
            case "patch":
                return HttpMethod.PATCH;
            default:
                throw new Error();
        }
    }
}

