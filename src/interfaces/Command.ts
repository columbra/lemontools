import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageEmbedOptions,
  PermissionResolvable,
} from "discord.js";
import request from "request";
import { theme } from "../../config.json";
import { Bot } from "../client/Client";
import { Article, TopCategories } from "./NYT";

export abstract class Command {
  bot: Bot;
  abstract name: string;
  abstract disabled?: boolean;
  abstract description: string;
  abstract usage?: string;
  abstract aliases?: string[];
  abstract args?: boolean;
  abstract example?: string;
  abstract cooldown: number;
  abstract category: string;
  abstract guildOnly: boolean;
  abstract data: Omit<
    SlashCommandBuilder,
    "addSubcommand" | "addSubcommandGroup"
  >;
  abstract sudo: boolean;
  abstract perms: PermissionResolvable[];

  abstract execute: (interaction: CommandInteraction) => Promise<any>;

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

  protected getNYTData(
    category: TopCategories,
    apikey: string
  ): Promise<Article[]> {
    return new Promise((resolve, reject) => {
      request(
        `https://api.nytimes.com/svc/topstories/v2/${category}.json?api-key=${apikey}`,

        (err, res, body) => {
          if (err) reject(err);
          let data;
          try {
            data = JSON.parse(body);
            resolve(data.results as Article[]);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
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
  protected shuffle(array: any[]) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  protected eph(content: string) {
    return {
      ephemeral: true,
      content,
    };
  }
}
