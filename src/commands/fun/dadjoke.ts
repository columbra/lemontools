import axios from "axios";
import Command from "../../classes/Command";
import { simpleEmbed } from "../../helper/util/embed";

export default new Command({
  name: "dadjoke",
  description: "The worst jokes of them all",
  category: "fun",
  perms: [],

  async execute({ bot, ctx }) {
    await ctx.deferReply()
    const res = await axios.get("https://icanhazdadjoke.com", {
      headers: {
        "User-Agent": "Lemon Tools v2 (jimke2000@gmail.com https://github.com/cooljim/lemontools)",
        "Accept": "text/plain"
      }
    })
    ctx.editReply({
      embeds: [
        simpleEmbed(`${res.data}`, bot)
      ]
    })
  },
});
