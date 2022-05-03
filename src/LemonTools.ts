/**
 * @fileoverview Extended version of the Discord.js Client
 * @since v3.0.0
 */

import { Client, Options } from "discord.js";
import config from "./config";
import Commands from "./managers/commands/Commands";
import Logger from "./managers/logs/Logger";

export default class LemonTools extends Client {
  // Managers
  public Logger = new Logger(this);
  public Commands = new Commands(this)

  constructor() {
    super({
      ...config.bot.options,
      intents: config.bot.intents,
      makeCache: Options.cacheWithLimits(config.bot.cache),
    });

    this.start();
  }

  async start() {
    await this.login(process.env.BOT_TOKEN);
    this.Logger.log(
      "info",
      "LemonTools",
      `Logged in as ${this.user?.tag ?? "an unknown user"}`
    );
  }
}
