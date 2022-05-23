/**
 * @fileoverview Resource usage monitoring and logging.
 */

import Manager from "../../classes/manager/Manager";
import type LemonTools from "../../LemonTools";
import prettyBytes from "../../utils/bytes/prettyBytes";
import DevUtils from "../../utils/dev/DevUtils";

export default class ResourceUsage extends Manager {
  constructor(lemontools: LemonTools) {
    super(lemontools, "ResourceUsage");

    if (DevUtils.isDev()) setInterval(() => this.logMemoryUsage(), 2_000);
  }

  async logMemoryUsage() {
    const { rss, heapTotal, heapUsed } = process.memoryUsage();
    if (DevUtils.isDev())
      this.lemontools.Logger.log(
        "verbose",
        "ResourceUsage",
        `RSS: ${prettyBytes(rss)} Heap: Used: ${prettyBytes(
          heapUsed
        )} Total: ${prettyBytes(heapTotal)}`
      );
  }
}
