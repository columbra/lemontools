import chalk from "chalk";
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  Options,
} from "discord.js";
import winston, { transports } from "winston";
import { CommandOptions } from "../typings/CommandItems";
import syncglob from "glob";
import { promisify } from "util";
import { CommandRegisterOptions } from "../typings/Bot";
import Event from "./Event";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import AutoCompleter from "./AutoComplete";

/**
 * --------------------
 * Constants
 * --------------------
 */
const glob = promisify(syncglob);

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
  debug: 4,
};
const loggerColours = {
  crit: "bgRed bold white",
  error: "bold red",
  warn: "yellow",
  info: "cyan",
  debug: "magenta bold",
};
const loggerFormat = winston.format.printf(
  ({ level, message, timestamp }) =>
    chalk`{magenta ${timestamp}} [${level}] ${message}`
);
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
});

export default class Bot extends Client {
  public commands = new Collection<string, CommandOptions>();
  public readonly logger: winston.Logger;
  public readonly config: Record<string, any>;
  public autocomplete = new Collection<string, AutoCompleter>();
  constructor() {
    super({
      intents: ["GUILDS"],
    });
    this.logger = winston.createLogger({
      levels: loggerLevels,
      transports: [
        new transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ colors: loggerColours }),
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            loggerFormat
          ),
          level: process.env.ENVIRONMENT === "debug" ? "debug" : "info",
        }),
        new transports.File({
          format: winston.format.combine(
            winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
            fileFormat
          ),
          filename: "log.log",
        }),
      ],
    });
    this.config = yaml.load(
      fs.readFileSync(path.join(__dirname, "../../config.yaml"), "utf-8")
    );
    this.logger.debug(`Loaded configuration`);
  }
  public start() {
    this.logger.debug(`Starting...`);
    if (process.env.ENVIRONMENT === "debug")
      this.logger.warn("Debug mode enabled.");
    if (process.env.ENVIRONMENT === "dev")
      this.logger.warn("Development mode enabled.");
    if (process.env.ENVIRONMENT === "production")
      this.logger.info("Production mode enabled.");
    if (
      process.env.ENVIRONMENT !== "debug" &&
      process.env.ENVIRONMENT !== "dev" &&
      process.env.ENVIRONMENT !== "production"
    )
      this.logger.warn(
        "Non-standard environment used. This may cause unexpected behaviour. Please reset the environment to one of debug, dev or production"
      );
    this.login(process.env.BOT_TOKEN);
    this._register();
  }
  private async _register() {
    /**
     * --------------------
     * Slash Commands
     * --------------------
     */
    const commands: ApplicationCommandDataResolvable[] = [];
    const commandFiles = await glob(
      path.join(__dirname, "../commands/**/*.{js,ts}")
    );

    for (const commandFile of commandFiles) {
      const command: CommandOptions = (await import(commandFile)).default;
      if (!command) {
        this.logger.error(`Command not found for file ${commandFile}.`);
        continue;
      }
      this.logger.debug(`Loading command ${command.name}`);
      this.commands.set(command.name, command);
      commands.push(command);
    }
    this.on("ready", () =>
      this._registerCommands({
        commands,
        guild: this._isDev() ? process.env.TEST_GUILD : null,
      })
    );

    /**
     * --------------------
     * Client Events
     * --------------------
     */
    const eventFiles = await glob(
      path.join(__dirname, "../events/**/*.{js,ts}")
    );

    for (const eventFile of eventFiles) {
      const event: Event<keyof ClientEvents> = (await import(eventFile))
        .default;
      this.on(event.event, (...args) => event.run(this, ...args));
      this.logger.debug(`Registered event listener for ${event.event}`);
    }

    /**
     * --------------------
     * Autocomplete
     * --------------------
     */
    const autoCompleteFiles = await glob(
      path.join(__dirname, "../autocomplete/*.{js,ts}")
    );

    for (const file of autoCompleteFiles) {
      const autoComplete: AutoCompleter = await import(file);
      this.autocomplete.set(autoComplete.command, autoComplete);
      this.logger.debug(
        `Registered auto completer for command ${autoComplete.command}`
      );
    }
  }

  private async _registerCommands({
    commands,
    guild: guildId,
  }: CommandRegisterOptions) {
    if (guildId) {
      const guild = await this.guilds.fetch(guildId);
      const registered = await guild.commands.set(commands);
      this.logger.info(`Registered commands for guild ${guild.name}`);
      for (const cmd of registered.values()) {
        this.logger.debug(`Registered command ${cmd.name}`);
      }
    } else {
      this.application?.commands.set(commands);
    }
  }
  private _isDev() {
    if (
      process.env.ENVIRONMENT === "debug" ||
      process.env.ENVIRONMENT === "dev"
    )
      return true;
    return false;
  }
}
