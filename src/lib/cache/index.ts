export default class CacheManager {
  private _cache = new Map<string, CacheObject>();
  public misses: number;
  public hits: number;

  constructor(public options: CacheOptions) {
    setInterval(this._sweep, options.sweepInterval ?? 60_000); // Default is every minute
  }
  /**
   * Set a key in the cache. Similar to `Map.set()`
   * @param key Key to set in cache, for later retreival. *Tip: use URLs!*
   * @param data Date to cache
   * @param remove Remove time. Can be date for precise time or number for how long to keep (in milliseconds). *Tip: use `Infinity` to keep forever*
   */
  public set(key: string, data: any, remove: Date | number) {
    type T = typeof data;
    const item: CacheObject<T> = {
      data: data,
      // If remove is a Date, keep as is, but if it is a number
      // (number = remove in x milliseconds) create a new Date for it
      remove:
        remove === Infinity
          ? undefined
          : remove instanceof Date
          ? remove
          : new Date(Date.now() + remove),
    };
    this._cache.set(key, item);
  }

  /**
   * Get something in cache. Similar to `Map.get()`
   * @param key Key in cache to get
   */
  public get(key: string): CacheObject<any> | undefined {
    const item = this._cache.get(key);
    if (item) this.hits++;
    else this.misses++;
    return item;
  }

  /**
   * Delete something in cache. Similar to `Map.delete()`
   * @param key Key in cache to remove
   */
  public delete(key: string) {
    this._cache.delete(key);
  }

  private _sweep() {
    const iterator = this._cache.entries();
    while (this._cache.size > (this.options.maxSize ?? Infinity)) {
      // While cache size is too big knock off first added item
      const [key] = iterator.next().value;
      this._cache.delete(key);
    }
    // Then, iterate through cache, deleting all expired CacheObjects
    for (const entry of this._cache.entries()) {
      const [key, element] = entry;
      // If element does not have removal time, continue
      if (!element.remove) continue;
      // If not expired, continue
      if (element.remove.getTime() > Date.now()) continue;
      // If all above conditions are met, delete
      this._cache.delete(key);
    }
  }
}

interface CacheObject<T = any> {
  // Data to cache
  data: T;
  // When to remove. Use null or undefined to never remove
  remove?: Date;
}

interface CacheOptions {
  // When to check for expired cache, milliseconds
  sweepInterval?: number;

  // Maximum cache size
  maxSize?: number;
}
