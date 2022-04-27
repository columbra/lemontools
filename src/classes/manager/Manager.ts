/**
 * @fileoverview Base structures for managers
 * @since v3.0.0
 */

import type LemonTools from "../../LemonTools";

export default class Manager {
  public readonly startTime = Date.now();
  constructor(
    public lemontools: LemonTools,
    public name: string,
    public opts: ManagerOpts = {}
  ) {}
}

export interface ManagerOpts {}
