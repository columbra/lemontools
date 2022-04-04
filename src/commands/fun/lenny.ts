import Command from "../../classes/Command";
import { simpleEmbed } from "../../helper/util/embed";

export default new Command({
  name: "lenny",
  description: "( ͡° ͜ʖ ͡°)",
  category: "fun",
  perms: [],
  options: [
    {
      name: "text",
      description: "Text to ( ͡° ͜ʖ ͡°)-ify",
      type: "STRING",
      required: true,
    },
  ],
  async execute({ bot, args, ctx }) {
    const text = args.getString("text");
    ctx.reply({
      embeds: [simpleEmbed(`( ͡° ͜ʖ ͡°) ${text} ( ͡° ͜ʖ ͡°)`, bot)],
    });
  },
});
