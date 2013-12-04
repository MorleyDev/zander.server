function startServer() {
    "use strict";

    var server = require('restify')
        .createServer({name : "zander"});

    server.get("/verify", function (request, response, next) {
        response.send(200);
        return next();
    });
    server.listen(process.env.zander_port || 1337, process.env.zander_host || "127.0.0.1");
}
module.exports.startServer = startServer;
