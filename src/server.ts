/// <reference path="../d.ts/DefinitelyTyped/node/node.d.ts" />
/// <reference path="controller/VerifyController.ts" />
/// <reference path="model/HttpResponse.ts" />
/// <reference path="model/HttpRequest.ts" />
/// <reference path="model/HttpMethod.ts" />

function startServer() {

    var server = require("restify")
        .createServer({name : "zander"});

    function addController(path : string, controller) {

        function createControllerRequestHandler(method : (r: model.HttpRequest) => model.HttpResponse) {
            return function (request, response, next) {
                var httpRequest : model.HttpRequest = new model.HttpRequest();
                httpRequest.method = model.StringToHttpMethod(request.method);
                httpRequest.headers = request.headers;
                httpRequest.parameters = request.parameters;

                var httpResponse : model.HttpResponse = method(httpRequest);
                httpResponse.content != null
                    ? response.send(httpResponse.statusCode, httpResponse.content)
                    : response.send(httpResponse.statusCode);

                return next();
            };
        }

        require("linq")
            .From(model.HttpMethod)
            .Select(function (x) { return model.HttpMethodToString(x); })
            .Where(function (x) { return controller[x] != null  })
            .ForEach(function (x) { server[x](path, createControllerRequestHandler(controller[x])) });
    }

    addController("/verify", new controller.VerifyController());

    server.listen(process.env.zander_port || 1337, process.env.zander_host || "127.0.0.1");
}
module.exports.startServer = startServer;
