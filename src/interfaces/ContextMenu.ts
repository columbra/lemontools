import {
  ContextMenuCommandBuilder,
  ContextMenuCommandType,
} from "@discordjs/builders";
import {
  ApplicationCommandType,
  ContextMenuInteraction,
  Interaction,
  MessageActionRow,
  MessageEmbed,
  MessageEmbedOptions,
  PermissionResolvable,
} from "discord.js";
import { theme } from "../../config.json";
import { Bot } from "../client/Client";

export abstract class ContextMenu {
  bot: Bot;
  abstract readonly name: string;
  abstract readonly data: ContextMenuCommandBuilder;

  abstract readonly type: ContextMenuCommandType;
  abstract readonly perms: PermissionResolvable[];
  abstract readonly cooldown: number;

  public constructor(bot: Bot) {
    this.bot = bot;
  }

  abstract execute: (
    interaction: ContextMenuInteraction
  ) => Promise<any> | Promise<never>;
  protected embed(opts: MessageEmbedOptions, interaction: Interaction) {
    const decimalColour = parseInt(theme.main.replace("#", ""), 16);
    return new MessageEmbed(opts)
      .setFooter(
        `Command run by ${interaction.user.tag}`,
        interaction.user.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(decimalColour);
  }

  protected errorEmbed(error: string | Error) {
    if (!(typeof error === "string")) {
      var trace = error.stack;
    }
    return new MessageEmbed()
      .setTimestamp()
      .setTitle("Whoops! An error occured whilst running a command")
      .setDescription(
        `**Error message**\n${error.toString()}\n\n**Stack Trace** ${
          trace ?? "No stack trace avaliable."
        }`
      )
      .setColor(16711680);
  }

  protected capitalise(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  protected simpleEmbed(description: string) {
    const decimalColour = parseInt(theme.main.replace("#", ""), 16);
    return new MessageEmbed()
      .setTimestamp()
      .setColor(decimalColour)
      .setDescription(description);
  }

  protected percentFromDecimal(decimal: number): string {
    return `${decimal * 100}%`;
  }

  protected calcNumberFromRatio(number: number, ratio: number): number {
    return Math.round(number / ratio) - number;
  }

  protected rnd(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }
  protected disabledComponents(
    components: MessageActionRow[]
  ): MessageActionRow[] {
    return components.map((row) => {
      return new MessageActionRow().addComponents(
        row.components.map((component) => component.setDisabled(true))
      );
    });
  }
}
