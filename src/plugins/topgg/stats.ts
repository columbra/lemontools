import axios from "axios";
import LemonPlugin from "../../classes/LemonPlugin";

export default new LemonPlugin(
  "topgg",
  async (bot) => {
    if (bot.isDev()) return;
    setInterval(async () => {
      axios.post(
        `https://top.gg/api/bots/${bot.user.id}/stats`,
        {
          server_count: (await bot.guilds.fetch()).size,
        },
        {
          headers: {
            Authorization: process.env.TOPGG_TOKEN,
          },
        }
      );
    }, 120_000);
  },
  {
    ready: true,
  }
);
