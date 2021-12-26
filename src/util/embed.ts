import {
  MessageEmbedOptions,
  Interaction,
  MessageEmbed,
  InteractionReplyOptions,
} from "discord.js";
import Bot from "../classes/Bot";

function embed(
  opt: MessageEmbedOptions,
  ctx: Interaction,
  bot: Bot
): MessageEmbed {
  return new MessageEmbed(opt)
    .setColor(parseInt(bot.config.style.colour.primary.replace("#", ""), 16))
    .setFooter(`Command run by ${ctx.user.username}`, ctx.user.avatarURL())
    .setTimestamp();
}
function simpleEmbed(str: string, bot: Bot): MessageEmbed {
  return new MessageEmbed()
    .setDescription(str)
    .setColor(
      parseInt(bot.config.config.style.colour.primary.replace("#", ""), 16)
    );
}

function errorMessage(err: string): InteractionReplyOptions {
  return {
    embeds: [new MessageEmbed().setDescription(err).setColor("RED")],
    ephemeral: true,
  };
}

export { simpleEmbed, embed, errorMessage };
