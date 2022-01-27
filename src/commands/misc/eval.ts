import Command from "../../classes/Command";
import { embed } from "../../util/embed";

export default new Command({
  name: "eval",
  description: "For developer use only.",
  category: "misc",
  perms: [],
  sudo: true,
  options: [
    {
      name: "js",
      description: "JavaScript to evaluate",
      type: "STRING",
      required: true,
    },
  ],
  async execute({ bot, args, ctx }) {
    await ctx.deferReply();
    const js = args.getString("js");
    const funct = Function("bot", "ctx", js);
    try {
      const ret = await funct(bot, ctx);
      ctx.editReply({
        embeds: [
          embed(
            {
              title: "Eval Success",
              description: `\`\`\`js\n${ret}\`\`\``,
            },
            ctx,
            bot
          ),
        ],
      });
    } catch (err) {
      ctx.editReply({
        embeds: [
          embed(
            {
              title: "Eval Faliure",
              description: `Error: \`\`\`${err}\`\`\``,
            },
            ctx,
            bot
          ),
        ],
      });
    }
  },
});
