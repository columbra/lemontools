import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "uppercase",
    description: "SCREAMING MOMENT",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to SCREAM",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    const screaming = text.toUpperCase();
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Original: **${text}**\nUppercased: **${screaming}**`,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
