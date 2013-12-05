before(function (done) {
    "use strict";

    var configuration = require(__dirname + "/config.json");

    process.env.zander_port = configuration.port;
    process.env.zander_host = configuration.host;

    require('../lib/server.js').startServer();
    done();
});
