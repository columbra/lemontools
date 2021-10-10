import { ClientEvents } from "discord.js";
import { Bot } from "../client/Client";
import {
  MessageEmbed,
  MessageEmbedOptions,
  CommandInteraction,
} from "discord.js";
import { theme } from "../../config.json";

export abstract class Event {
  bot: Bot;
  abstract event: keyof ClientEvents;

  abstract execute: (...args: any[]) => Promise<any>;

  public constructor(bot: Bot) {
    this.bot = bot;
  }

  protected embed(opts: MessageEmbedOptions, interaction: CommandInteraction) {
    const decimalColour = parseInt(theme.main.replace("#", ""), 16);
    return new MessageEmbed(opts)
      .setFooter(
        `Command run by ${interaction.user.tag}`,
        interaction.user.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(decimalColour);
  }
}
