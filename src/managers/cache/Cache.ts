/**
 * @fileoverview Disk cache manager
 * @since v3.0.0
 */

import Manager from "../../classes/manager/Manager";
import type LemonTools from "../../LemonTools";
import fs from "fs/promises";
import path from "path";
import config from "../../config";
import Flatted from "flatted";

export default class Cache extends Manager {
  readonly #path: string;
  #sweepScheduled: number;
  constructor(lemontools: LemonTools) {
    super(lemontools, "Cache");
    this.#path = path.resolve(config.diskcache.path);
    this.#sweepScheduled = Date.now() + config.diskcache.sweepEvery;
  }

  /**
   * Set a key-value pair in the cache
   * @param key Key to set
   * @param value Value to set
   * @param expires Expiration time in seconds (Optional)
   */
  public async set<T>(key: string, value: T, expires?: number) {
    const cache = await this.#getCache();
    // Intiate sweep if needed
    if (Date.now() > this.#sweepScheduled) this.#sweep();
    cache[key] = {
      value,
      timestamp: Date.now(),
      expires: expires ? expires + Date.now() : undefined,
    };
    return this.#writeCache(cache);
  }

  /**
   * Get a key-value pair from the cache
   * @param key Key to get
   * @returns Value of the key, or undefined if key does not exist
   */
  public async get<T = unknown>(key: string): Promise<undefined | T> {
    const cache = await this.#getCache();
    // Intiate sweep if needed
    if (Date.now() > this.#sweepScheduled) this.#sweep();
    return cache[key].value as undefined | T;
  }

  /**
   * Sweep cache file for expired keys
   */
  async #sweep() {
    const cache = await this.#getCache();
    const now = Date.now();
    for (const key in cache) {
      if (typeof cache[key].expires === "number")
        if (cache[key].expires! < now) {
          delete cache[key];
        }
    }
    await this.#writeCache(cache);
  }

  async #getCache(): Promise<Record<string, CacheElement>> {
    const file = await fs.readFile(this.#path, "utf8");
    return Flatted.parse(file);
  }

  async #writeCache(cache: Record<string, CacheElement>) {
    await fs.writeFile(this.#path, Flatted.stringify(cache));
  }
}

interface CacheElement<T = unknown> {
  value: T;
  timestamp: number;
  expires?: number;
}
