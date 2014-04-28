/// <reference path="../typings/node/node.d.ts" />
/// <reference path="controller/VerifyController.ts" />
/// <reference path="controller/UserController.ts" />
/// <reference path="model/HttpResponse.ts" />
/// <reference path="model/HttpRequest.ts" />
/// <reference path="service/AuthenticateUserAsTarget.ts" />
/// <reference path="data/bootstrap_database.ts" />
/// <reference path="data/AuthenticateUser.ts" />

function startServer(configuration, database) {

    var restify = require("restify");
    var server = restify.createServer({name: "zander"})
        .use(restify.fullResponse())
        .use(restify.bodyParser())
        .use(restify.authorizationParser());

    if (configuration.throttle)
        server.use(restify.throttle(configuration.throttle));

    function addController(path:string, controller) {

        console.log("Register controller to path " + path);

        function createControllerRequestHandler(method:(r:model.HttpRequest, c:(h:model.HttpResponse) => void) => void) {
            return function (request, response, next) {

                try {
                    var httpRequest:model.HttpRequest = new model.HttpRequest();
                    httpRequest.authorization = request.authorization;
                    httpRequest.headers = request.headers;
                    httpRequest.parameters = request.params;
                    httpRequest.body = request.body;

                    method(httpRequest, function (httpResponse:model.HttpResponse) {
                        httpResponse.content != null
                            ? response.send(httpResponse.statusCode, httpResponse.content)
                            : response.send(httpResponse.statusCode);
                    });

                }
                catch(e) {
                    console.log(e);
                    response.send(500, { "code" : "InternalServerError" });
                }
                return next();
            };
        }

        // For each of these HTTP methods, if the controller has the function with the same name then bind the
        // function and handler so that it will be invoked on such a request on path
        ["get", "head", "post", "put", "del"]
            .filter(function (x) {
                return controller[x] != null;
            })
            .forEach(function (x) {
                console.log("Register " + x + " to path " + path);
                server[x](path, createControllerRequestHandler(controller[x]))
            });
    }

    var controllers = { };
    controllers["verify"] = new controller.VerifyController();

    var authenticateUser = new data.AuthenticateUser(configuration, database);
    var authenticateUserAsTarget = new service.AuthenticateUserAsTarget(authenticateUser);
    controllers["user"] = new controller.UserController(authenticateUserAsTarget);

    addController("/verify", controllers["verify"]);
    addController("/user", controllers["user"]);
    addController("/user/:target", controllers["user"]);

    server.listen(configuration.port, configuration.host);
    return controllers;
}

module.exports.startServer = startServer;
