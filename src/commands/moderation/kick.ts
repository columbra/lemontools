import { GuildMember } from "discord.js";
import Command from "../../classes/Command";
import { errorMessage, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "kick",
  description: "Kick someone",
  category: "moderation",
  perms: ["KICK_MEMBERS"],

  options: [
    {
      name: "member",
      description: "Member to kick",
      type: "USER",
      required: true,
    },
    {
      name: "reason",
      description: "Reason for kick",
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
    if (!ctx.guild.me.permissions.has("KICK_MEMBERS"))
      return ctx.reply(
        errorMessage(
          "I don't have permission to kick members! Please give me permission to kick members"
        )
      );
    await ctx.deferReply();
    member.kick(reason ?? `/kick from ${bot.config.bot.name}`).then((g) => {
      ctx.editReply({
        embeds: [
          simpleEmbed(`Successfully kicked ${g} (\`${g.user.tag}\`)`, bot),
        ],
      });
    });
  },
});
