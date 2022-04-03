import Command from "../../classes/Command";
import ms from "../../lib/ms";
import { epherrf, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "timeout",
  description: "Timeout a user",
  category: "moderation",
  perms: ["MODERATE_MEMBERS"],
  options: [
    {
      name: "user",
      description: "The user to timeout",
      required: true,
      type: "USER",
    },
    {
      name: "duration",
      description: "The duration of the timeout",
      required: true,
      type: "STRING",
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      required: false,
      type: "STRING",
    },
  ],
  async execute({ bot, args, ctx }) {
    await ctx.deferReply();
    const duration = await ms(args.getString("duration"));
    const user = await args.getUser("user");
    const reason = args.getString("reason");
    if (!duration) return ctx.editReply(epherrf("Invalid duration"));
    if (!user) return ctx.editReply(epherrf("Invalid user"));
    const member = await ctx.guild.members.fetch(user);
    if (!member) return ctx.editReply(epherrf("Could not find user"));
    member
      .timeout(duration, reason)
      .then(() => {
        ctx.editReply({
          embeds: [
            simpleEmbed(
              `Successfully timed out ${member.user.tag} for ${ms(duration)}`,
              bot
            ),
          ],
        });
      })
      .catch(() => {
        ctx.editReply(
          epherrf(
            "Failed to timeout user. Perhaps they are already timed out, or that I don't have permission to time them out. (Max timeout is 2 weeks)"
          )
        );
      });
  },
});
