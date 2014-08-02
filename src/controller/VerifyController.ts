module controller {
    export interface VerifyController {
        get(request:model.HttpRequest):Q.IPromise<model.HttpResponse>;
    }
}
