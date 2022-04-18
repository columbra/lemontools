import { ClientEvents, Collection } from "discord.js";
import { promisify } from "util";
import Bot from "../../classes/NewBot";
import syncGlob from "glob";
import path from "path";
import Event from "../../classes/Event";
import Manager from "../../classes/Manager";

const glob = promisify(syncGlob);

class EventManager extends Manager {
  private readonly _events: Event<keyof ClientEvents>[] = [];

  constructor(bot: Bot) {
    super("EventManager", bot);
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
    this.bot.logger.verbose(`EventManager: ${eventFiles.length} events found`);
    for (const file of eventFiles) {
      const event: Event<keyof ClientEvents> = (await import(file)).default;
      this._events.push(event);
    }

    this._events.forEach((event, i) => {
      this.bot.logger.verbose(
        `EventManager: Registered event ${event.event}, (#${i+1})`
      );
      this.bot.on(event.event, (...args) => {
        this.bot.logger.verbose(`EventManager: ${event.event} fired`);
        event.run(this.bot, ...args);
      });
    });
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
