/// <reference path="../typings/node/node.d.ts" />
/// <reference path="controller/VerifyController.ts" />
/// <reference path="controller/UserController.ts" />
/// <reference path="controller/ProjectController.ts" />
/// <reference path="model/HttpResponse.ts" />
/// <reference path="model/HttpRequest.ts" />
/// <reference path="service/AuthenticateUserAsTarget.ts" />
/// <reference path="data/bootstrap_database.ts" />
/// <reference path="data/AuthenticateUser.ts" />
/// <reference path="data/user/CRUD.ts" />
/// <reference path="data/project/CRUD.ts" />

function startServer(configuration, database) {

    var restify = require("restify");
    var server = restify.createServer({name: "zander"})
        .use(restify.fullResponse())
        .use(restify.bodyParser())
        .use(restify.authorizationParser())
        .use(restify.requestLogger());

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
                    httpRequest.log = request.log;

                    method(httpRequest, function (httpResponse:model.HttpResponse) {
                        httpResponse.content != null
                            ? response.send(httpResponse.statusCode, httpResponse.content)
                            : response.send(httpResponse.statusCode);
                    });
                }
                catch(e) {
                    request.log.error(e);
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

                var controllerHandler = function (request, callback) {
                    controller[x](request, callback);
                };
                server[x](path, createControllerRequestHandler(controllerHandler))
            });
    }

    var datas = {
        "user" : {
            "authenticate" : new data.AuthenticateUser(configuration, database),
            "create": new data.user.CreateUserInDatabase(configuration.hashAlgorithm, database),
            "get": new data.user.GetUserFromDatabase(database),
            "delete" : new data.user.DeleteUserFromDatabase(database),
            "update" : new data.user.UpdateUserInDatabase(configuration.hashAlgorithm, database)
        },
        "project" : {
            "create" : new data.project.CreateProjectInDatabase(database),
            "get" : new data.project.GetProjectFromDatabase(database),
            "delete" : new data.project.DeleteProjectFromDatabase(database),
            "update" : new data.project.UpdateProjectInDatabase(database),
            "deleteForUser" : new data.project.DeleteUsersProjectsFromDatabase(database)
        }
    };

    var services = {
        "authenticate" : {
            "user" : new service.AuthenticateUserAsTarget(datas.user.authenticate)
        }
    };

    var controllers = {
        "verify" : new controller.VerifyController(),
        "user" : new controller.UserController(configuration,
            services.authenticate.user,
            datas.user.create,
            datas.user.get,
            datas.user.delete,
            datas.user.update,
            datas.project.deleteForUser),
        "project" : new controller.ProjectController(configuration,
            services.authenticate.user,
            datas.project.create,
            datas.project.get,
            datas.project.delete,
            datas.project.update)

    };

    addController("/verify", controllers.verify);
    addController("/user", controllers.user);
    addController("/user/:target", controllers.user);
    addController("/project", controllers.project);
    addController("/project/:target", controllers.project);

    server.listen(configuration.port);
}

module.exports.startServer = startServer;
