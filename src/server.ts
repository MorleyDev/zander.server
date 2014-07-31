/// <reference path='model/Configuration.ts' />

/// <reference path='../typings/node/node.d.ts'/>
/// <reference path='controller/ProjectController.ts'/>
/// <reference path='controller/ProjectsController.ts'/>
/// <reference path='controller/UserController.ts'/>
/// <reference path='controller/UsersController.ts'/>
/// <reference path='controller/VerifyController.ts'/>

/// <reference path='model/HttpRequest.ts'/>
/// <reference path='model/HttpResponse.ts'/>

/// <reference path="data/bootstrapDatabase.ts" />
/// <reference path="data/ProjectRepository.ts" />
/// <reference path="data/UserRepository.ts" />

function startServer(configuration : model.Configuration, database : any) {

    var restify = require("restify");
    var server = restify.createServer({name: "zander"})
        .pre(restify.pre.sanitizePath())
        .use(restify.fullResponse())
        .use(restify.bodyParser())
        .use(restify.authorizationParser())
        .use(restify.requestLogger());

    if (configuration.throttle)
        server.use(restify.throttle(configuration.throttle));

    var datas : any = { };
    datas.project = new data.ProjectRepository(database);
    datas.user = new data.UserRepository(configuration.hashAlgorithm, database);
    datas.authenticate = new data.BasicAuthenticateUser(configuration, datas.user);

    var services : any = { };
    services.authenticate = new service.AuthenticationService(datas.authenticate);

    var controllers = {
        "verify": new controller.VerifyController(),
        "user": new controller.UserController(datas.user, datas.project),
        "users": new controller.UsersController(configuration.host, datas.user, datas.project),
        "project": new controller.ProjectController(datas.project),
        "projects": new controller.ProjectsController(configuration.host, datas.project)
    };

    function addController(path:string, controller) {

        console.log("Register controller to path " + path);

        function createControllerRequestHandler(method:(r:model.HttpRequest) => Q.IPromise<model.HttpResponse>) {
            return function (request, response, next) {
                var httpRequest:model.HttpRequest = new model.HttpRequest();
                httpRequest.authorization = request.authorization;
                httpRequest.headers = request.headers;
                httpRequest.parameters = request.params;
                httpRequest.body = request.body;
                httpRequest.log = request.log;

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

        // For each of these HTTP methods, if the controller has the function with the same name then bind the
        // function and handler so that it will be invoked on such a request on path
        ["get", "head", "post", "put", "del"]
            .filter(function (x) {
                return controller[x] !== undefined;
            })
            .forEach(function (x) {
                console.log("Register " + x + " to path " + path);

                server[x](path, createControllerRequestHandler(function (request : model.HttpRequest) : Q.IPromise<model.HttpResponse> {
                    var minAuthLevel = controller[x + "AuthLevel"] || model.AuthenticationLevel.None;
                    return services.authenticate.atLeast(minAuthLevel, request, function (request) {
                        return controller[x](request);
                    });
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
