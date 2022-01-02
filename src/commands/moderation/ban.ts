import { GuildMember } from "discord.js";
import Command from "../../classes/Command";
import { errorMessage, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "ban",
  description: "Ban someone",
  category: "moderation",
  perms: ["BAN_MEMBERS"],

  options: [
    {
      name: "member",
      description: "Member to ban",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for ban",
      type: "STRING",
      required: false,
    },
  ],
  example: "@Mapler#6973 Being very bad",
  usage: "<member> [reason]",

  async execute({ args, ctx, bot }) {
    const member = args.getMember("member");
    const reason = args.getString("reason");
    if (!(member instanceof GuildMember))
      return ctx.reply(
        errorMessage(
          "There was an error fetching that member. Try again later."
        )
      );
    if (!ctx.guild.me.permissions.has("BAN_MEMBERS"))
      return ctx.reply(
        errorMessage(
          "I don't have permission to ban members! Please give me permission to ban members"
        )
      );
    await ctx.deferReply();
    member
      .ban({
        reason: reason ?? `/ban from ${bot.config.bot.name}`,
      })
      .then((g) => {
        ctx.editReply({
          embeds: [
            simpleEmbed(`Successfully banned ${g} (\`${g.user.tag}\`)`, bot),
          ],
        });
      });
  },
});
