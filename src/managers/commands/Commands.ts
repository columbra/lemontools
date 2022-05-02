/**
 * @fileoverview Command loader and manager 
 * @since v3.0.0
 */

import Manager from "../../classes/manager/Manager";

export default class Commands extends Manager {
  public commands = new Map<string, Function>();
}