import axios from "axios";
import LemonPlugin from "../../classes/LemonPlugin";

export default new LemonPlugin(
  "topgg",
  async (bot) => {
    axios.post(`https://top.gg/api/bots/${bot.user.id}/stats`, {
      server_count: (await bot.guilds.fetch()).size,
    });
  },
  {
    ready: true,
  }
);
