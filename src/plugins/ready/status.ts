import LemonPlugin from "../../classes/LemonPlugin";

export default new LemonPlugin("status", async (bot) => {
  setInterval(async () => {
    bot.user.setPresence({
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
  }, 60_000);
}, {
  ready: true
});
