var config = require("./config.json");
config.host = process.env.zander_host || data.host;
config.port = process.env.zander_port || data.port;

if (!config.goduser)
    config.goduser = { };
config.goduser.name = process.env.zander_god_username || config.goduser.name;
config.goduser.password = process.env.zander_god_password || config.goduser.password;

const zander = require("./lib/server.js");

zander.bootstrapDatabase(config, function(err) {
    if (err)
        throw err;

    zander.startServer(config);
    console.log("Zander server running: " + config.host + ":" + config.port);
});
