var config = require("./config.json");
config.host = process.env.zander_host || data.host;
config.port = process.env.zander_port || data.port;

const zander = require("./lib/server.js");

zander.bootstrapDatabase(config, function(err) {
    if (err)
        throw err;

    zander.startServer(config);
    console.log("Zander server running: " + config.host + ":" + config.port);
});
