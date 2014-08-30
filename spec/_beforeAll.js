var controllers;
before(function (done) {
    "use strict";

    var configuration = require(__dirname + "/config.json");
    var zander = require('../lib/server.js');
    zander.bootstrapDatabase(configuration, function(err, database) {
        if (err) {
            throw "Failed to bootstrap database";
        }

        controllers = zander.startServer(configuration, database);
        done();
    })
});
