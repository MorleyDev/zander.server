function startServer(configuration:model.Configuration, database:any) {

    var Q = require('q');

    var restify = require("restify");
    var server = restify.createServer({name: "zander"})
        .pre(restify.pre.sanitizePath())
        .use(restify.fullResponse())
        .use(restify.bodyParser())
        .use(restify.authorizationParser())
        .use(restify.requestLogger())
        .use(restify.queryParser());

    if (configuration.throttle)
        server.use(restify.throttle(configuration.throttle));

    var datas = new data.DataFactory(configuration, database);
    var services = new service.ServiceFactory(datas);
    var controllers = new controller.ControllerFactory(configuration, services);
    var validators = new validate.ValidatorFactory();

    function addController(path:string, controller:any) {

        console.log("Register " + controller.constructor.name + " to path " + path);

        function createControllerRequestHandler(method:(r:model.HttpRequest) => Q.IPromise<model.HttpResponse>) {
            return function (request:any, response:any, next:any) {
                var httpRequest:model.HttpRequest = new model.HttpRequest();
                httpRequest.authorization = request.authorization;
                httpRequest.headers = request.headers;
                httpRequest.parameters = request.params;
                httpRequest.body = request.body;
                httpRequest.log = request.log;
                httpRequest.query = request.query;

                method(httpRequest)
                    .then((httpResponse:model.HttpResponse) => {
                        httpResponse.content !== null
                            ? response.send(httpResponse.statusCode, httpResponse.content)
                            : response.send(httpResponse.statusCode);
                    }, (e) => {
                        request.log.error(e);
                        response.send(500, { "code": "InternalServerError" })
                    });
                return next();
            };
        }

        var httpMethods = ["get", "head", "post", "put", "patch", "del"];

        // For each of these HTTP methods, if the controller has the function with the same name then bind the
        // function and handler so that it will be invoked on such a request on path
        httpMethods
            .filter(function (x:string) {
                return controller[x] !== undefined;
            })
            .forEach(function (x:string) {
                var minAuthLevel = controller[x + "AuthLevel"] || model.AuthenticationLevel.None;
                var validator : string = controller[x + "Validator"];
                var authoriser : string = controller[x + "Authoriser"];
                console.log("Register " + x + " to path " + path + " with min authentication level " + minAuthLevel);

                server[x](path, createControllerRequestHandler((request:model.HttpRequest):Q.IPromise<model.HttpResponse> => {
                    var actualRequest = (request:model.HttpRequest):Q.IPromise<model.HttpResponse> => {
                        if (validator) {
                            var result = validators.get(validator).apply(request);
                            if (!result.success) {
                                return Q(new model.HttpResponse(400, {
                                    "code": "BadRequest",
                                    "message": result.reason
                                }));
                            }
                        }

                        if (!authoriser)
                            return controller[x](request);

                        return services.authorisers.get(authoriser)
                            .authenticate(request.user, request.parameters.target)
                            .then((authorised:service.AuthorisationResult) => {
                                switch (authorised) {
                                    case service.AuthorisationResult.NotFound:
                                        return Q(new model.HttpResponse(404, { "code": "ResourceNotFound", "message": "Resource Not Found" }));

                                    case service.AuthorisationResult.Failure:
                                        return Q(new model.HttpResponse(403, { "code": "Forbidden" }));

                                    case service.AuthorisationResult.Success:
                                        return controller[x](request);
                                }
                            });
                    };
                    return services.authenticate.atLeast(minAuthLevel, request, actualRequest);
                }));
            });
    }

    addController("/verify", controllers.verify);
    addController("/user/", controllers.users);
    addController("/user/:target", controllers.user);
    addController("/project/", controllers.projects);
    addController("/project/:target", controllers.project);

    server.listen(configuration.port);
}

module.exports.startServer = startServer;
