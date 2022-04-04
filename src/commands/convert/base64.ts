import Command from "../../classes/Command";
import { simpleEmbed } from "../../helper/util/embed";

export default new Command({
  name: "base64",
  description: "Encode something in Base64",
  category: "convert",
  perms: [],
  options: [
    {
      name: "text",
      description: "Text to encode",
      required: true,
      type: "STRING",
    },
  ],
  async execute({ bot, args, ctx }) {
    const text = args.getString("text");
    ctx.reply({
      embeds: [
        simpleEmbed(
          `**Original:** \`${text}\`\n**Converted:** \`${Buffer.from(
            text
          ).toString("base64")}\``,
          bot
        ),
      ],
    });
  },
});
