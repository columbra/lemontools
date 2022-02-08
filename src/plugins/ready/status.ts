import Plugin from "../../classes/Plugin";

export default new Plugin(
  async (bot) => {
    bot.user.setPresence({
      status: "online",
      activities: [
        {
          name: `${(await bot.guilds.fetch()).size} servers`,
          type: "WATCHING",
        },
        {
          name: bot.config.style.status.message,
          type: bot.config.style.status.type,
        },
      ],
    });
  },
  { ready: true }
);
