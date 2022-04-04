import Command from "../../classes/Command";
import { simpleEmbed } from "../../helper/util/embed";

export default new Command({
  name: "base",
  description:
    "Convert numbers from radix 10 (base 10, aka our number system) to another",
  category: "convert",
  perms: [],
  options: [
    {
      name: "base",
      description: "Base to convert to",
      required: true,
      type: "NUMBER",
      maxValue: 36,
      minValue: 2,
    },
    {
      name: "number",
      description: "Number to convert",
      required: true,
      type: "NUMBER",
      maxValue: Number.MAX_SAFE_INTEGER,
    },
  ],
  example: "16 12",
  async execute({ bot, args, ctx }) {
    const number = args.getNumber("number");
    const base = args.getNumber("base");
    ctx.reply({
      embeds: [
        simpleEmbed(
          `**Original:** \`${number}\`\n**Converted:** \`${parseInt(
            number.toString(),
            base
          )}\`\n**Base:** \`${base}\``,
          bot
        ),
      ],
    });
  },
});
