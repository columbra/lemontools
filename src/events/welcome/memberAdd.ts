import Event from "../../classes/Event";
import UserBlockingPreferences from "../../schema/UserBlockingPreferences";
import Welcome, { WelcomeInterface } from "../../schema/Welcome";

export default new Event("guildMemberAdd", async (bot, member) => {
  const welcome: WelcomeInterface | undefined = await Welcome.findOne({
    serverId: member.guild.id,
  }).exec();
  bot.logger.debug(`Event welcome fired ${member.user.tag}`);
  if (!welcome) return; // No welcome found === stop
  const user = await UserBlockingPreferences.findOne({ userId: member.user.id })
    .lean()
    .exec();
  if (user) {
    if (user.blocks.includes("welcomes")) return; // User has blocked welcome messages
  }
  member
    .send({
      content: `This message was sent from the server **${member.guild.name}**`,
      embeds: [welcome.embed],
    })
    .catch((r) =>
      bot.logger.warn(
        `Something went wrong DMing user ${member.user.tag} a welcome DM from server ${member.guild.name}. They may have blocked us! Reason: ${r}`
      )
    );
});
