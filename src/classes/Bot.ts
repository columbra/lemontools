import { InfluxDB as Influx, Point } from "@influxdata/influxdb-client";
import chalk from "chalk";
import {
  ApplicationCommandDataResolvable,
  Client,
  ClientEvents,
  Collection,
  MessageEmbed,
  MessageReaction,
  Options,
  User,
} from "discord.js";
import fs from "fs";
import syncglob from "glob";
import yaml from "js-yaml";
import mongoose from "mongoose";
import os from "os";
import path from "path";
import { promisify } from "util";
import winston, { transports } from "winston";
import CacheManager from "../lib/cache";
import Giveaway from "../lib/discord-giveaways/src/Giveaway";
import Reminder from "../schema/Reminder";
import { CommandRegisterOptions } from "../typings/Bot";
import { CommandOptions } from "../typings/CommandItems";
import { EmbedColours } from "../util/embed";
import AutoCompleter from "./AutoComplete";
import Event from "./Event";
import GiveawaysManager from "./GiveawayManager";
import LemonPlugin from "./LemonPlugin";

import "tslib"


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
  public GiveawayManager: GiveawaysManager;
  public db: typeof mongoose.Connection;
  private readonly InfluxConfig = {
    org: process.env.ORG,
    bucket: process.env.BUCKET,
    url: process.env.INFLUX_URL,
  };
  private InfluxDB: Influx;
  public cache = new CacheManager({});
  constructor() {
    super({
      intents: ["GUILDS", "GUILD_MESSAGE_REACTIONS", "GUILD_MEMBERS"],
      // Credit: salvage
      /**
       * @author Salvage_Dev#3650
       * See discordjs.guide
       */
      makeCache: Options.cacheWithLimits({
        MessageManager: 150, 
        PresenceManager: 0,
        GuildStickerManager: 0,
        ApplicationCommandManager: 100,
        GuildBanManager: 0,
        GuildMemberManager: 30,
        GuildEmojiManager: 0,
        BaseGuildEmojiManager: 0,
        UserManager: 50,
        GuildInviteManager: 0,
        GuildScheduledEventManager: 0,
        ReactionManager: 0,
        ReactionUserManager: 0,
        ThreadManager: 10,
        VoiceStateManager: 0,
        StageInstanceManager: 0,
        ThreadMemberManager: 10
      })
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
    this.InfluxDB = new Influx({
      url: this.InfluxConfig.url,
      token: process.env.INFLUX,
    });
    this.logger.debug(`Loaded configuration`);
  }
  public async start() {
    this.logger.info(`Start function called`);
    this.logger.debug(`Connecting to MongoDB database`);
    this.db = (await mongoose.connect(process.env.MONGO)).Connection;
    this.logger.info("Connected to MongoDB database.");

    this.logger.info("Giveaways ready");
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

    this.logger.info(`Calling setup functions`);
    // Call setup functions
    this._startPlugins();
    this.login(process.env.BOT_TOKEN);
    this._register();
    this._initMonitoring();
    this._initReminders();
    this._initGiveawaysDMs();
    this.logger.info("Influx monitoring set up");
  }
  private async _startPlugins() {
    const pluginsPaths = await glob(
      path.join(__dirname, "../plugins/**/*.{js,ts}")
    );
    const ready: LemonPlugin[] = [];
    const plugins: LemonPlugin[] = [];
    Promise.all(
      pluginsPaths.map(async (pluginPath) => {
        const plugin: LemonPlugin = (await import(pluginPath)).default;
        if (plugin.options?.ready) return ready.push(plugin);
        plugins.push(plugin);
      })
    ).then(() => {
      this.logger.info(`${plugins.length + ready.length} plugins loaded.`);
      this.on("ready", () => {
        ready.forEach((plugin) => plugin.func(this));
      });
      plugins.forEach((plugin) => plugin.func(this));
    });
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
        guild: this.isDev() ? process.env.TEST_GUILD : null,
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
      const autoComplete: AutoCompleter = (await import(file)).default;
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

  isDev() {


    if (
      process.env.ENVIRONMENT === "debug" ||
      process.env.ENVIRONMENT === "dev"
    )
      return true;
    return false;
  }

  private async _initMonitoring() {
    setInterval(async () => {
      const write = this.InfluxDB.getWriteApi(
        this.InfluxConfig.org,
        this.InfluxConfig.bucket
      );
      write.useDefaultTags({
        env: this.isDev() ? "development" : "production",
      });
      const mem = new Point("memory");
      const cpu = new Point("cpu");
      const botinfo = new Point("botinfo");
      const latency = new Point("latency");

      /**
       * Latency
       */
      latency.floatField("ws", this.ws.ping || 0);

      mem
        .floatField("heapUsed_mb", process.memoryUsage().heapUsed / 1048576) // 1048576 = 1024 ** 2
        .floatField("heapTotal_mb", process.memoryUsage().heapTotal / 1048576);

      /**
       * @IMPORTANT
       *
       * CPU measurement reporting has changed. Instead of reporting cpu total usage
       * we are now only reporting CPU used by the bot itself.
       */

      cpu.floatField("percentage", this._percentiseCpu(os.cpus()));

      botinfo.floatField("servers", (await this.guilds.fetch()).size);

      /**
       * @IMPORTANT
       *
       * New field: cache_servers! These should help monitor
       * how full the cache is and if it's being cleared or not.
       *
       * Field measurement change: Instead of reducing guild member
       * size, get cache size of actual users. This will indicate the amount
       * of users in cache, not the amount of users in *server* cache
       */
      botinfo.floatField("cache_members", this.users.cache.size);
      botinfo.floatField("cache_servers", this.guilds.cache.size);

      write.writePoints([mem, cpu, botinfo, latency]);
      write.close().then(() => this.logger.debug("Wrote to Influx monitoring"));
    }, 60_000);
  }
  private _percentiseCpu(cpus: os.CpuInfo[]) {
    // The following is taken from https://stackoverflow.com/questions/63289933/get-process-cpu-usage-in-percentage

    // Get first cpu (since node only uses 1 cpu)
    const cpu = cpus[0];

    // Get total time
    const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0);

    // Normalize the one returned by process.cpuUsage()
    // (microseconds VS miliseconds)
    const usage = process.cpuUsage();
    const currentCPUUsage = (usage.user + usage.system) * 1000;

    // Find out the percentage used for this specific CPU and return it
    return (currentCPUUsage / total) * 100;
  }

  private async _initReminders() {
    // Wait for ready
    await this._readyPromise(this);
    // First check if any timers have already expired
    // $lt = get all that are lower than Date.now() (which means)
    // they have expired
    this.logger.info(`Attempting to find any expired reminders`);
    const expd = await Reminder.find({ time: { $lt: Date.now() } });
    this.logger.debug(`Found ${expd.length} expired reminders (initial sweep)`);
    Promise.all(
      expd.map(async (r) => {
        const user = await this.users.fetch(r.userId);
        user
          .send({
            embeds: [
              new MessageEmbed()
                .setTitle("A reminder has expired")
                .setDescription(
                  `Your reminder set for <t:${Math.round(
                    r.time / 1000
                  )}:F> has expired. The reminder was:
          
          ${r.reminder}`
                )
                .setThumbnail("https://img.icons8.com/fluency/344/alarm.png")
                .setFooter({
                  text: "Icons From icons8.com",
                })
                .setColor(this.config.style.colour.primary),
              ,
            ],
          })
          .then(() => {
            // Teardown function
            // DO NOT REMOVE .then since without it the
            // document does not delete. I have no idea
            // why, dont question it.
            Reminder.deleteOne({ uuid: r.uuid }).then();
          })
          .catch((err) =>
            this.logger.error(
              `Error sending reminder to user ${r.userId}! ${err}`
            )
          );
      })
    );

    // Then check every minute
    setInterval(async () => {
      const expd = await Reminder.find({ time: { $lt: Date.now() } });
      this.logger.debug(
        `Found ${expd.length} expired reminders (after initial)`
      );
      if (expd.length === 0) return;
      Promise.all(
        expd.map(async (r) => {
          const user = await this.users.fetch(r.userId);
          user
            .send({
              embeds: [
                new MessageEmbed()
                  .setTitle("A reminder has expired")
                  .setDescription(
                    `Your reminder set for <t:${Math.round(
                      r.time / 1000
                    )}:F> has expired. The reminder was:
          
          ${r.reminder}`
                  )
                  .setThumbnail("https://img.icons8.com/fluency/344/alarm.png")
                  .setFooter({
                    text: "Icons From icons8.com",
                  })
                  .setColor(this.config.style.colour.primary),
              ],
            })
            .then(() => {
              // Teardown function
              // DO NOT REMOVE .then since without it the
              // document does not delete. I have no idea
              // why, dont question it.
              Reminder.deleteOne({ uuid: r.uuid }).then();
            })
            .catch((err) =>
              this.logger.error(
                `Error sending reminder to user ${r.userId}! ${err}`
              )
            );
        })
      );
    }, 10_000); // TODO: Replace with 60k
  }

  private _readyPromise(that: this) {
    return new Promise((resolve) => {
      if (this.isReady()) return resolve(true);
      that.on("ready", () => resolve(true));
    });
  }

  private _initGiveawaysDMs() {
    // Initialise DMs on react
    this.GiveawayManager.on(
      "giveawayReactionAdded",
      async (giveaway: Giveaway, member: User, reaction: MessageReaction) => {
        member
          .send({
            embeds: [
              new MessageEmbed()
                .setDescription(
                  `${
                    reaction.emoji
                  } Your entry into the giveaway :arrow_upper_right: [**${
                    giveaway.prize
                  }**](${giveaway.messageURL}) has succeeded!\n\nServer: **${
                    (await this.guilds.fetch(giveaway.guildId)).name
                  }**`
                )
                .setFooter({
                  text: "This bot is providing a service. To disable further DMs, block the bot.",
                })
                .setColor(EmbedColours.EMBED_COLOUR),
            ],
          })
          .catch((r) =>
            this.logger.warn(
              `Failed whilst sending message to user about giveaway entried: ${r}`
            )
          );
      }
    );
  }
}
