function parseConfig(config) {
    config.host = process.env.zander_host || config.host || "127.0.0.1";
    config.port = process.env.zander_port || config.port || 1337;

    if (!config.goduser)
        config.goduser = { };

    config.goduser.name = process.env.zander_god_username || config.goduser.name;
    config.goduser.password = process.env.zander_god_password || config.goduser.password;
    if (config.goduser.name && config.goduser.name.length <= 20)
        console.log("[WARNING] Super user with name of 20 characters or less");

    config.hashAlgorithm = config.hashAlgorithm || "sha256";
    config.throttle = config.throttle || { "burst" : 100, "rate" : 50, "ip" : true };

    return config;
}

var config = parseConfig(require("./config.json"));
const zander = require("./lib/server.js");

    zander.bootstrapDatabase(config, function(err, database) {
    if (err)
        throw err;

    zander.startServer(config, database);
    console.log("Zander server running: " + config.host + ":" + config.port);
});
