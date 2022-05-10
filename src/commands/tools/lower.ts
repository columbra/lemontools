import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "lowercase",
    description: "make something all lowercase",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to lowercase",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    const reversed = text.toLowerCase();
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Original: **${text}**\nLowercased: **${reversed}**`,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
