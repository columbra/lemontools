import {
  Interaction,
  InteractionReplyOptions,
  MessageEmbed,
  MessageEmbedOptions,
} from "discord.js";
import { MessageActionRow, MessageButton } from "discord.js";
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

const inviteRow = new MessageActionRow().addComponents([
  new MessageButton()
    .setStyle("LINK")
    .setURL("https://top.gg/bot/896309687136436234")
    .setLabel("Vote"),
  new MessageButton()
    .setStyle("LINK")
    .setURL(
      "https://discord.com/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608"
    )
    .setLabel("Invite"),
  new MessageButton()
    .setStyle("LINK")
    .setURL("https://cooljim.github.io/lemontools")
    .setLabel("Website"),
  new MessageButton()
    .setStyle("LINK")
    .setURL("https://discord.gg/h9bRr6FNsM")
    .setLabel("Support Server"),
]);

export { simpleEmbed, embed, errorMessage, inviteRow };
