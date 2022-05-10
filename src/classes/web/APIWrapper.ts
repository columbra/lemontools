/**
 * @fileoverview API Wrapper class, inspired by Switchblade
 * @since v3.0.0
 */

import type LemonTools from "../../LemonTools";

export default abstract class APIWrapper {
  public readonly name: string;
  constructor(public lemontools: LemonTools, opts: APIWrapperOpts) {
    this.name = opts.name;
  }
}

export interface APIWrapperOpts {
  name: string;
}
