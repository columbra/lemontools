/**
 * @fileoverview Manager for Events
 * @since v3.0.0
 */

import Manager from "../../classes/manager/Manager";
import type LemonTools from "../../LemonTools";
import FileSystemUtils from "../../utils/files/FileSystemUtils";
import type EventListener from "../../classes/events/EventListener";
import type { ClientEvents } from "discord.js";

export default class Events extends Manager {
  constructor(lemontools: LemonTools) {
    super(lemontools, "Events");
    this.load();
  }

  async load(path = "event/**/*") {
    const events = await FileSystemUtils.importGlob<
      EventListener<keyof ClientEvents>
    >(path);
    await Promise.all(
      events.map(async (event) => {
        this.lemontools.on(event.event, (...args: any) => {
          event.execute(
            {
              event: event.event,
              lemontools: this.lemontools,
            },
            ...args
          );
        });
      })
    );
    this.lemontools.Logger.log(
      "info",
      "Events",
      `Loaded ${events.length} events`
    );
  }
}
