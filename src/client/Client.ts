/** @format */

import winston, { transports, Logger } from "winston";
import {
  Client,
  MessageEmbedOptions,
  Message,
  Intents,
  Collection,
  MessageEmbed,
  Snowflake,
} from "discord.js";
import glob from "glob";
import { promisify } from "util";
import { Config } from "../interfaces/Config";
import dotenv from "dotenv";
import { Command } from "../interfaces/Command";
import { Cooldown } from "../interfaces/Cooldown";
import chalk from "chalk";
import path from "path";
import { Event } from "../interfaces/Event";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

dotenv.config();
const globPromise = promisify(glob);

/**
 * --------------------
 * Logger
 * --------------------
 */
const loggerLevels = {
  crit: 0,
  error: 1,
  warn: 2,
  info: 3,
  verbose: 4,
};
const loggerColours = {
  crit: "bgRed bold white",
  error: "bold red",
  warn: "yellow",
  info: "cyan",
  verbose: "magenta bold",
};
const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
  return chalk`{magenta ${timestamp}} [${level}] ${message}`;
});
const logger = winston.createLogger({
  levels: loggerLevels,
  transports: [
    new transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: loggerColours }),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        loggerFormat
      ),
    }),
    new transports.File({
      filename: "log.log",
    }),
  ],
});

export class Bot extends Client {
  public config: Config | undefined;
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public categories: Set<string> = new Set();
  public cooldowns: Collection<string, Cooldown[]> = new Collection();
  public readonly logger: Logger = logger;
  private someRest: REST = new REST({ version: "9" }).setToken(
    process.env.TOKEN ?? ""
  );

  public constructor() {
    super({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    });
  }
  public async start(config: Config): Promise<void> {
    const commandsToPush: {
      name: string;
      description: string;
      options: any[];
      default_permission: boolean | undefined;
    }[] = [];
    this.logger.info(`${config.name} is starting...`);
    this.config = config as Config;
    this.login(process.env.TOKEN);

    this.on("ready", () => {
      this.logger.info(`${config.name} is ready!`);
    });

    const commandFiles = await globPromise(
      path.join(__dirname, `../commands/**/*.{js,ts}`)
    );
    this.logger.info(`Loaded command files info memory!`);

    commandFiles.map(async (file) => {
      const Acommand = (await import(file)).default;
      const command = new Acommand(this);
      if (command.disabled) return;
      this.commands.set(command.name, command);
      if (command.aliases?.length) {
        command.aliases.map((val: any) => this.aliases.set(val, command.name));
      }
      this.categories.add(command.category);

      commandsToPush.push(command.data.toJSON());
    });

    const eventFiles = await globPromise(
      path.join(__dirname, `../events/**/*.{js,ts}`)
    );
    this.logger.info("Loaded event files into memory");

    eventFiles.map(async (file) => {
      const Aevent = (await import(file)).default;
      const event: Event = new Aevent(this);
      this.events.set(event.event, event);
      this.on(event.event, (...args: unknown[]) => {
        event.execute(args);
      });
    });

    this.logger.info("Refreshing slash commands");
    if (!config.production) {
      this.logger.warn(
        "Non-production environment detected! Only refreshing commands for test guild"
      );
      try {
        await this.someRest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID?.replaceAll('"', "") ?? "",
            config.testServer
          ),
          { body: commandsToPush }
        );
      } catch (err) {
        this.logger.error(
          `Error occured whilst refreshing slash commands. ${err}`
        );
      }
    } else {
      this.logger.info(
        "Production environment detected! Refreshing all commands globally"
      );
      try {
        await this.someRest.put(
          Routes.applicationCommands(process.env.CLIENT_ID as string),
          { body: commandsToPush }
        );
      } catch (err) {
        this.logger.error(
          `Error occured whilst refreshing slash commands. ${err}`
        );
      }
    }

    this.logger.info("Refreshed all slash commands");
  }
}
