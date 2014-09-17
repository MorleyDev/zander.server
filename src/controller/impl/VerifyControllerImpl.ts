module controller.impl {
    var Q = require('q');

    export class VerifyControllerImpl implements VerifyController {

        private applicationService: service.ApplicationService;

        public getAuthLevel: model.AuthenticationLevel = model.AuthenticationLevel.None;
        public getValidator: string = null;
        public getAuthoriser: string = null;

        constructor(applicationService: service.ApplicationService) {
            this.applicationService = applicationService;
        }

        public get(request:model.HttpRequest): Q.IPromise<model.HttpResponse> {
            return this.applicationService.getVersion().then((version: string) => {
                return Q(new model.HttpResponse(200, {
                    "version": version 
                }));
            });
        }
    }
}
