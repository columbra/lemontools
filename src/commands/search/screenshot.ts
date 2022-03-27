import Command from "../../classes/Command";
import { epherrf, simpleEmbed } from "../../util/embed";
import capture from "capture-website";

const regex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

export default new Command({
  name: "screenshot",
  description: "Takes a screenshot of a website.",
  category: "search",
  perms: [],
  options: [
    {
      name: "url",
      description: "The URL to take a screenshot of.",
      required: true,
      type: "STRING",
    },
  ],
  async execute({ bot, args, ctx }) {
    const url = args.getString("url");
    if (!regex.test(url))
      return ctx.reply(epherrf("Invalid URL! URL needs to be a valid URL."));
    await ctx.deferReply();
    try {
      const screenshot = await capture.buffer(url, {
        type: "png",
      });
      ctx.reply({
        embeds: [
          simpleEmbed(
            `Screen shot of [:arrow_upper_right: website](${url}) was completed`,
            bot
          ),
        ],
        files: [screenshot],
      });
    } catch (err) {
      ctx.editReply(
        epherrf(
          `There was an error trying to take a screenshot of [:arrow_upper_right: that website](${url}). Perhaps that link is invalid? Error: ${err}`
        )
      );
      bot.logger.warn(`Error during screenshot ${err}`);
    }
  },
});
