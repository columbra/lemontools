import { ClientEvents } from "discord.js";
import { Bot } from "../client/Client";

export abstract class Event {
  bot: Bot
  abstract event: keyof ClientEvents

  abstract execute: (...args: any[]) => Promise<any>

  public constructor(bot: Bot) {
    this.bot = bot
  }
}