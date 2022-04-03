import Command from "../../classes/Command";
import { simpleEmbed } from "../../util/embed";

export default new Command({
  name: "unixtime",
  description: "Convert unix time to a date",
  category: "convert",
  perms: [],
  options: [
    {
      name: "unix",
      description:
        "The unix time to convert (Default: milliseconds since epoch)",
      required: true,
      type: "NUMBER",
    },
    {
      name: "format",
      description: "Format of Unix Time (Milliseconds vs. Seconds)",
      required: false,
      type: "STRING",
      choices: [
        {
          name: "milliseconds",
          value: "milliseconds",
        },
        {
          name: "seconds",
          value: "seconds",
        },
      ],
    },
  ],
  async execute({ bot, args, ctx }) {
    const format = args.getString("format") || "milliseconds";
    const unix = args.getNumber("unix");
    const formatted = format === "milliseconds" ? Math.round(unix / 1000) : unix;
    ctx.reply({
      embeds: [
        simpleEmbed(
          `**Unix Time:** \`${unix}\`\n**Date Stamp:** <t:${formatted}:F> (<t:${formatted}:R>)`,
          bot
        ),
      ],
    });
  },
});
