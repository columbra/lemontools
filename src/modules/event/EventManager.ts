import {
  ApplicationCommandDataResolvable,
  ClientEvents,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Permissions,
} from "discord.js";
import { promisify } from "util";
import Command from "../../classes/Command";
import Bot from "../../classes/NewBot";
import syncGlob from "glob";
import path from "path";
import getConfig from "../../helper/config/GetConfig";
import Event from "../../classes/Event";

const glob = promisify(syncGlob);

class EventManager {
  private _create = Date.now();
  private readonly _events: Collection<string, Event<keyof ClientEvents>>;

  constructor(private bot: Bot) {
    bot.logger.info(
      `EventManager successfully started. Took ${Date.now() - this._create}ms`
    );
    this.loadEvents();
  }

  private async loadEvents() {
    const _start = Date.now();
    this.bot.logger.info("EventManager: Loading events");
    const eventFiles: string[] = await glob(
      path.join(__dirname, "../../events/**/*.{ts,js}")
    );
    if (!eventFiles.length)
      return this.bot.logger.error("EventManager: No events found.");
    for (const file of eventFiles) {
      const event: Event<keyof ClientEvents> = (await import(file)).default;
      this._events.set(event.event, event);
    }
    Promise.all(
      this._events.map(async (event) => {
        this.bot.on(event.event, (...args) => event.run(this.bot, ...args));
      })
    );

    this.bot.logger.info(
      `EventManager: Event registering successful. Took ${
        Date.now() - _start
      }ms`
    );
  }

  public get events() {
    return this._events;
  }
  public set events(value: typeof this._events) {
    this.bot.logger.error(
      "EventManager: Cannot override events, it is read only."
    );
    return;
  }
}

export default EventManager;
