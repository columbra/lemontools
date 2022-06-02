import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import NumberUtils from "../../utils/number/NumberUtils";

export default new Command(
  {
    name: "random",
    description: "Generate a random number between two numbers (inclusive)",
    category: "tools",
    options: [
      {
        name: "min",
        description: "The minimum number",
        required: true,
        type: "NUMBER",
      },
      {
        name: "max",
        description: "The maximum number",
        required: true,
        type: "NUMBER",
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const min = ctx.interaction.options.getNumber("min", true);
    const max = ctx.interaction.options.getNumber("max", true);
    const number = NumberUtils.random(min, max);
    return ctx.reply(
      new Reply(
        new LemonToolsEmbed({
          description: `**Number:** \`${number}\`\nMin: \`${min}\`\nMax: \`${max}\``,
        }, ctx.interaction.user)
      )
    );
  }
);
