import type {
  BaseGuildTextChannel,
  CategoryChannel,
  DMChannel,
  GuildBasedChannel,
  TextBasedChannel,
} from "discord.js";
import { ChannelTypes } from "discord.js/typings/enums";
import Command from "../../classes/Command";
import ms, { StringValue } from "../../lib/ms";
import { errorMessage, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "giveaway",
  category: "giveaways",
  description: "Start a giveaway",
  perms: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "channel",
      description: "Channel to start giveaway in",
      type: "CHANNEL",
      channelTypes: [ChannelTypes.GUILD_TEXT],
      required: true,
    },
    {
      name: "duration",
      description: "How long the giveaway will last",
      type: "STRING",
      required: true,
    },
    {
      name: "prize",
      description: "What will you be giving away?",
      type: "STRING",
      required: true,
    },
    {
      name: "winners",
      description: "How many people can win this giveaway?",
      type: "INTEGER",
      minValue: 1,
      maxValue: 256,
      required: true,
    },
    {
      name: "message",
      description: "Message for giveaway",
      type: "STRING",
    },
    {
      name: "endmessage",
      description: "Message when the giveaway is over",
      type: "STRING",
    },
  ],

  async execute({ bot, ctx, args }) {
    const { GiveawayManager } = bot;
    const channel = args.getChannel("channel") as any;

    const prize = args.getString("prize");
    const winners = args.getInteger("winners");
    const message = args.getString("message") || ":tada: GIVEAWAY! :tada:";
    const endMessage =
      args.getString("endmessage") ||
      ":partying_face: The giveaway is over! :partying_face:";
    const duration = args.getString("duration") as StringValue;
    const durationMillis: number | null = await ms(duration).catch(() => null);
    if (!durationMillis)
      return ctx.reply(
        errorMessage(
          `Please specify a valid duration... \`${duration}\` is not a valid duration!`
        )
      );
    if (
      !channel
        .permissionsFor(ctx.guild.me)
        .has(["READ_MESSAGE_HISTORY", "SEND_MESSAGES", "ADD_REACTIONS"])
    )
      return ctx.reply(
        errorMessage(
          `Sorry, but I don't have permissions to talk or add reactions in the channel <#${channel.id}>! Please give me permissions to add reactions, read message history and send messages in that channel!`
        )
      );
    GiveawayManager.start(channel, {
      prize,
      winnerCount: winners,
      duration: +duration,
      messages: {
        giveaway: message,
        giveawayEnded: endMessage,
      },
    }).then((g) => {
      ctx.reply({
        embeds: [simpleEmbed(`Your giveaway for **${prize}** has begun! [Click to go see](${g.messageURL})`, bot)],
      });
    });
  },
});
