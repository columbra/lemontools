const client = require("../../index");
const colors = require("colors");

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[ONLINE] ${client.user.tag} is online and ready to use.`.brightGreen);
})