
function parseConfig(config) {
    config.host = process.env.zander_host || config.host || "127.0.0.1";
    config.port = process.env.zander_port || config.port || 1337;

    if (!config.goduser)
        config.goduser = { };

    config.goduser.name = process.env.zander_god_username || config.goduser.name;
    config.goduser.password = process.env.zander_god_password || config.goduser.password;
    config.hashAlgorithm = config.hashAlgorithm || "sha256";

}
var config = parseConfig(require("./config.json"));

const zander = require("./lib/server.js");

    zander.bootstrapDatabase(config, function(err, database) {
    if (err)
        throw err;

    zander.startServer(config, database);
    console.log("Zander server running: " + config.host + ":" + config.port);
});
