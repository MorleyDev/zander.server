before(function (done) {
    "use strict";

    var configuration = require(__dirname + "/config.json");

    var zander = require('../lib/server.js');
    zander.bootstrapDatabase(configuration, function(err) {
        if (err)
            throw "Failed to bootstrap database";

        zander.startServer(configuration);
        done();
    })
});
