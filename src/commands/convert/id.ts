import Command from "../../classes/Command";
import { epherrf, simpleEmbed } from "../../helper/util/embed";
import { validateSnowflake } from "../../helper/utility/discord/snowflake/convert";

export default new Command({
  name: "convertid",
  description: "Convert a Discord ID to a date",
  category: "convert",
  perms: [],
  options: [
    {
      name: "snowflake",
      description: "The ID (snowflake) to convert",
      required: true,
      type: "STRING",
    },
  ],
  example: "495064579538419712",
  async execute({ bot, args, ctx }) {
    const snowflake = args.getString("snowflake", true);
    const timestamp = validateSnowflake(snowflake);
    if (timestamp.error) return ctx.reply(epherrf(`${timestamp.message}`));
    return ctx.reply({
      embeds: [
        simpleEmbed(
          `**Input:** ${snowflake}\n**Result:** <t:${Math.round(
            timestamp.data.getTime() / 1000
          )}:F>`
        ),
      ],
    });
  },
});
