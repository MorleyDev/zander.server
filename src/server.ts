/// <reference path="../typings/node/node.d.ts" />
/// <reference path="controller/VerifyController.ts" />
/// <reference path="controller/UserController.ts" />
/// <reference path="model/HttpResponse.ts" />
/// <reference path="model/HttpRequest.ts" />
/// <reference path="data/bootstrap_database.ts" />

function startServer(configuration) {

    var restify = require("restify");
    var server = restify.createServer({name: "zander"})
        .use(restify.fullResponse())
        .use(restify.bodyParser());

    function addController(path:string, controller) {

        console.log("Register controller to path " + path);

        function createControllerRequestHandler(method:(r:model.HttpRequest, c:(h:model.HttpResponse) => void) => void) {
            return function (request, response, next) {

                var httpRequest:model.HttpRequest = new model.HttpRequest();
                httpRequest.headers = request.headers;
                httpRequest.parameters = request.parameters;
                httpRequest.body = request.body;

                method(httpRequest, function (httpResponse:model.HttpResponse) {
                    httpResponse.content != null
                        ? response.send(httpResponse.statusCode, httpResponse.content)
                        : response.send(httpResponse.statusCode);
                });
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

    addController("/verify", new controller.VerifyController());
    addController("/user", new controller.UserController());

    server.listen(configuration.port || 1337, configuration.host || "127.0.0.1");
}

module.exports.startServer = startServer;
