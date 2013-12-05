var data = require("./config.json");
process.env.zander_host = process.env.zander_host || data.host;
process.env.zander_port = process.env.zander_port || data.port;

require("./lib/server.js").startServer();
console.log("Zander server running: " + process.env.zander_host + ":" + process.env.zander_port);
