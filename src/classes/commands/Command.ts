/**
 * @fileoverview Command structure
 * @since v3.0.0
 */

import type {
  ApplicationCommandOptionData,
  ApplicationCommandSubCommandData,
  ApplicationCommandSubGroupData,
  PermissionResolvable,
} from "discord.js";
import type LemonTools from "../../LemonTools";
import type CommandCustomContext from "./CommandCustomContext";

export default class Command {
  constructor(public opts: CommandOpts, public execute: CommandExecute) {}
}

export interface CommandOpts {
  name: string;
  description: string;
  category: string;
  cooldown?: number;
  options?: Exclude<
    ApplicationCommandOptionData,
    ApplicationCommandSubCommandData | ApplicationCommandSubGroupData
  >[];
  reqs?: CommandOptsRequirements;
}

export interface CommandExecuteParams {
  ctx: CommandCustomContext;
  lemontools: LemonTools;
}

export type CommandExecute<T = unknown> = (
  params: CommandExecuteParams
) => Promise<T>;

export interface CommandOptsRequirements {
  permissions?: PermissionResolvable[];
  sudo?: boolean;
}
