import Command from "../../classes/Command";
import { epherrf, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "strings",
  description: "String and text tools",
  category: "convert",
  perms: [],
  options: [
    {
      name: "length",
      description: "Get the length of a string",
      type: "SUB_COMMAND",
      options: [
        {
          name: "string",
          description: "The string to get the length of",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "lower",
      description: "Set all letters in string to lowercase",
      type: "SUB_COMMAND",
      options: [
        {
          name: "string",
          description: "The string to lowercase",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "upper",
      description: "UPPERCASE a string",
      type: "SUB_COMMAND",
      options: [
        {
          name: "string",
          description: "The string to UPPERCASE",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "reverse",
      description: "esreveR a string",
      type: "SUB_COMMAND",
      options: [
        {
          name: "string",
          description: "The string to esreveR",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  async execute({ bot, args, ctx }) {
    const sub = args.getSubcommand(true);
    const string = args.getString("string");

    switch (sub) {
      case "length":
        ctx.reply({
          embeds: [
            simpleEmbed(`Length of \`${string}\`: **${string.length}**`, bot),
          ],
        });
        break;
      case "lower":
        ctx.reply({
          embeds: [
            simpleEmbed(
              `Lowercase of: \`${string}\`: \`${string.toLowerCase()}\``,
              bot
            ),
          ],
        });
        break;
      case "upper":
        ctx.reply({
          embeds: [
            simpleEmbed(
              `Uppercase of: \`${string}\`: \`${string.toUpperCase()}\``,
              bot
            ),
          ],
        });
        break;
      case "reverse":
        ctx.reply({
          embeds: [
            simpleEmbed(
              `Reverse of \`${string}\`: \`${string
                .split("")
                .reverse()
                .join("")}\``,
              bot
            ),
          ],
        });
        break;

      default:
        ctx.reply(
          epherrf(
            "Something went wrong. Try again later or join our support server and open a ticket."
          )
        );
        break;
    }
  },
});
