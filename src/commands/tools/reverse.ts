import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "reverse",
    description: "Reverse something; esreveR!",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to reverse",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    const reversed = text.split("").reverse().join("");
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Original: **${text}**\nReversed: **${reversed}**`,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
