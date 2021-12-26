import Command from "../../classes/Command";
import { embed, inviteRow } from "../../util/embed";
import { LemonEmojis } from "../../util/emoji";

export default new Command({
  name: "info",
  description: "Get some information about Lemon Tools",
  perms: [],
  category: "misc.",
  async execute({ bot, ctx, args }) {
    ctx.reply({
      embeds: [
        embed(
          {
            title: `Information about ${bot.config.bot.name}`,
            description: bot.config.bot.description,
            fields: [
              {
                name: "Stats for nerds",
                value: `${LemonEmojis.Node} Node Version: \`${process.version}\`
                :hammer_and_wrench: Architecture: \`${process.arch}\`
                ${LemonEmojis.v8} v8 Engine Version: \`${process.versions.v8}\``,
              },
            ],
          },

          ctx,
          bot
        ),
      ],
      components: [inviteRow],
    });
  },
});
