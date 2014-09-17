module controller.impl {
    var Q = require('q');

    export class VerifyControllerImpl implements VerifyController {

        private pkgVersion: string;

        public getAuthLevel: model.AuthenticationLevel = model.AuthenticationLevel.None;
        public getValidator: string = null;
        public getAuthoriser: string = null;

        constructor(packageInfo: any) {
            this.pkgVersion = packageInfo.version;
        }

        public get(request:model.HttpRequest): Q.IPromise<model.HttpResponse> {
            return Q(new model.HttpResponse(200, {
                "version": this.pkgVersion
            }));
        }
    }
}
