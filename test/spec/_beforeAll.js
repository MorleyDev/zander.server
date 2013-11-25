before(function (done) {
    "use strict";
    process.env.zander_port = 1339;
    process.env.zander_host = "127.0.0.1";

    require('../../src/server.js').startServer();
    done();
});
