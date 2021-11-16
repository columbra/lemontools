/** @format */

import { REST } from "@discordjs/rest";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import chalk from "chalk";
import { Routes } from "discord-api-types/v9";
import {
  Client,
  Collection,
  Guild,
  HexColorString,
  Intents,
  Message,
} from "discord.js";
import dotenv from "dotenv";
import glob from "glob";
import mongoose from "mongoose";
import * as osu from "node-os-utils";
import path from "path";
import { promisify } from "util";
import winston, { Logger, transports } from "winston";
import AutoPoster, { DJSPoster, DJSSharderPoster } from "../deps/topgg";
import { Command } from "../interfaces/Command";
import { Config } from "../interfaces/Config";
import { ContextMenu } from "../interfaces/ContextMenu";
import { Cooldown } from "../interfaces/Cooldown";
import { Event } from "../interfaces/Event";
import MongooseGiveaways from "../interfaces/GiveawaysManager";

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
const fileFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}] ${message}`;
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
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        fileFormat
      ),
      filename: "log.log",
    }),
  ],
});

export class Bot extends Client {
  public config: Config | undefined;
  public commands: Collection<string, Command> = new Collection();
  public contextMenu: Collection<string, ContextMenu> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public categories: Set<string> = new Set();
  public cooldowns: Collection<string, Cooldown[]> = new Collection();
  public readonly logger: Logger = logger;
  private someRest: REST = new REST({ version: "9" }).setToken(
    process.env.TOKEN ?? ""
  );
  public mongoose!: typeof mongoose;
  public giveawayManager!: MongooseGiveaways;
  public topggStats!: DJSPoster | DJSSharderPoster;
  private readonly Influx: { org: string; bucket: string; url: string };
  private InfluxClient;
  public snipedMessages = new Collection<string, Message[]>(); // Array of Sniped Messages, ID is per channel. Max is 3 snipes per channel
  public recentMessages = new Collection<string, Message[]>(); // Array of recent messages ID is per channel. If message is deleted it will look up the message

  constructor() {
    super({
      intents: [
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
      partials: ["MESSAGE"],
    });
    this.Influx = {
      org: process.env.ORG ?? "Lemontools",
      bucket: process.env.BUCKET ?? "Lemontools monitoring",
      url: process.env.URL ?? "http://localhost:8086",
    };
    this.InfluxClient = new InfluxDB({
      url: this.Influx.url,
      token: process.env.INFLUX,
    });
  }
  public async start(config: Config): Promise<void> {
    if (!process.env.MONGOOSE_URI)
      this.logger.error(
        new Error("You need to provide a MongoDB URI for Giveaways to work!")
      );
    this.mongoose = await mongoose.connect(process.env.MONGOOSE_URI ?? "");
    const commandsToPush: {
      name: string;
      description: string;
      options: any[];
      default_permission: boolean | undefined;
    }[] = [];
    const contextsToPush: any[] = [];
    this.logger.info(`${config.name} is starting...`);
    this.config = config as Config;
    this.giveawayManager = new MongooseGiveaways(this, {
      default: {
        botsCanWin: false,
        embedColor: (config.theme.main as HexColorString) ?? "YELLOW",
        reaction: "🎉",
        embedColorEnd: "#36393F",
      },
    });
    this.login(process.env.TOKEN);

    this.once("ready", () => {
      this.logger.info(`${config.name} is ready!`);
      this.initMonitoring();
    });
    if (!process.env.TOKEN) {
      this.logger.error(
        "Token was not defined! Make sure you have a .env file with the TOKEN field!"
      );
      throw null;
    }
    if (this.config?.production && process.env.TOPGG) {
      this.topggStats = AutoPoster(process.env.TOPGG, this, {
        postOnStart: true,
      });
    } else if (!this.config?.production) {
      this.logger.warn(
        "Non-production environment detected! Not posting to top.gg with statistics."
      );
    } else {
      this.logger.warn(
        "Production environment detected, but no top.gg token! Proceeding without refreshing statistics..."
      );
    }

    const contextFiles = await globPromise(
      path.join(__dirname, `../context/**/*.{js,ts}`)
    );
    this.logger.info("Loaded context menu files into memory");

    contextFiles.forEach(async (file) => {
      const Acontext = (await import(file)).default;
      const context: ContextMenu = new Acontext(this);
      this.contextMenu.set(context.name, context);
      const data = context.data.toJSON();
      // delete data.default_permission;
      contextsToPush.push(data);
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

    this.logger.info("Refreshing commands");
    if (!config.production) {
      this.logger.warn(
        "Non-production environment detected! Only refreshing commands for test guild"
      );
      try {
        const res = await this.someRest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID?.replaceAll('"', "") ?? "",
            config.testServer
          ),
          { body: [...commandsToPush, ...contextsToPush] }
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
          { body: [...contextsToPush, ...commandsToPush] }
        );
      } catch (err) {
        this.logger.error(
          `Error occured whilst refreshing slash commands. ${err}`
        );
      }
    }

    this.logger.info("Refreshed all slash commands");
  }
  private async initMonitoring() {
    setInterval(async () => {
      const token = process.env.INFLUX;
      if (!token) {
        this.logger.warn(
          "InfluxDB token missing. Will not write monitoring data to DB!"
        );
        return;
      }
      const writeApi = this.InfluxClient.getWriteApi(
        this.Influx.org,
        this.Influx.bucket
      );
      writeApi.useDefaultTags({
        env: this.config?.production ? "production" : "development",
      });
      const mem = new Point("memory");
      const cpu = new Point("cpu");
      const botinfo = new Point("botinfo");

      mem
        .floatField("heapUsed_mb", process.memoryUsage().heapUsed / 1024 / 1024)
        .floatField(
          "heapTotal_mb",
          process.memoryUsage().heapTotal / 1024 / 1024
        );
      cpu.floatField("percentage", await osu.cpu.usage());
      botinfo.floatField("servers", (await this.guilds.fetch()).size);
      botinfo.floatField(
        "cache_members",
        this.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)
      );

      writeApi.writePoints([mem, cpu, botinfo]);
      writeApi.close();
    }, 3000);
  }
}
