import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

const isBinary = /^\b[0 1]+\b$/;

export default new Command(
  {
    name: "binary",
    description: "Convert some text into binary",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to convert into binary",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text: string = ctx.interaction.options.getString("text", true);
    if (text.length >= 200)
      return InteractionUtils.userError(
        ctx.interaction,
        `Binary conversion is limited to 200 characters for performance reasons.`
      );
    if (isBinary.test(text)) {
      return ctx.reply(
        new Reply(
          new LemonToolsEmbed(
            {
              description: `Binary: \`${text}\`\nText: \`${text
                .split(" ")
                .map((bin) => String.fromCharCode(parseInt(bin, 2))).join("")}\``,
            },
            ctx.interaction.user
          )
        )
      );
    }
    return ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Text: \`${text}\`\nBinary: \`${text2Binary(text)}\``,
          },
          ctx.interaction.user
        )
      )
    );
  }
);

function text2Binary(string: string) {
  return string
    .split("")
    .map((char) => char.charCodeAt(0).toString(2))
    .join(" ");
}
