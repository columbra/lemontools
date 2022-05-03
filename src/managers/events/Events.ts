/**
 * @fileoverview Manager for Events
 * @since v3.0.0
 */

import Manager from "../../classes/manager/Manager";
import type LemonTools from "../../LemonTools";

export default class Events extends Manager {
  constructor(lemontools: LemonTools) {
    super(lemontools, "Events");
  }
}
