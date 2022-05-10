import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "length",
    description: "Find the length of some text",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to find the length of",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    const length = text.length.toString();
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Original: **${text}**\nLength: **${length}**`,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
