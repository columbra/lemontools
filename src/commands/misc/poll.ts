import { TextChannel } from "discord.js";
import Command from "../../classes/Command";
import { embed, simpleEmbed } from "../../util/embed";
import { epherr } from "../../util/strings";

export default new Command({
  name: "poll",
  description: "Create a quick reaction-based poll.",
  category: "misc",
  perms: [],
  options: [
    {
      name: "question",
      description: "Question to ask (must be yes/no)",
      type: "STRING",
      required: true,
    },
    {
      name: "channel",
      description: "Channel to send poll to",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
    },
  ],
  async execute({ bot, args, ctx }) {
    if (!ctx.guild)
      return ctx.reply(epherr`This command can't be used in DMs.`);
    const question = args.getString("question");
    const channel =
      (args.getChannel("channel", false) as TextChannel) ??
      (ctx.channel as TextChannel);
    if (question.length > 1024)
      return ctx.reply(
        epherr`Hey! Your question must be less than 1024 characters in length!`
      );
    const em = embed(
      { title: `${ctx.user.tag} asks...`, description: question },
      ctx,
      bot
    );
    const poll = await channel.send({ embeds: [em] });
    poll
      .react("⬆") // Up arrow
      .then(() => poll.react("⬇")) // Down arrow
      .then((r) => {
        ctx.reply({
          embeds: [
            simpleEmbed(
              `Poll successfully created!\n[**:arrow_upper_right: Go to poll**](${r.message.url})`,
              bot
            ),
          ],
        });
      })
      .catch(
        (e) =>
          ctx.channel.send(epherr`Something went wrong!`) && bot.logger.error(e)
      );
  },
});
