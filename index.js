// Thank you, https://github.com/TFAGaming/DiscordJS-V14-Bot-Template for the V14 template!
// Our github repo is located at: https://github.com/Compositr/lemontools (Gitea perm offline)

const { Client, Partials, Collection, GatewayIntentBits } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],

  // You can change this to whatever you want:
  presence: {
    activities: [{
      name: "NEW and BETTER!!!  |  /help",
      type: 0
    }],
    status: 'online'
  }
});


require('https').createServer((req, res) => res.end('Ready.')).listen(3000);
function http2https(link) {

const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[ISSUE] A token is needed for the bot to run. Please input it in the config.json file or an ENV. For more information, please check the README.md file.".red);
  process.exit(1);
};

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events", "mongoose"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[ISSUE] An error has occured while logging in to the bot. Please check the token and try again.");
    console.error(`[ISSUE] Error from Discord's API: ${err}`);
    process.exit(1);

  });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH] Unhandled Rejection: ${err}`.red);
  console.error(promise);
});
}
