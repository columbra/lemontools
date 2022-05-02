/**
 * @fileoverview Command structure
 * @since v3.0.0
 */

import type { PermissionResolvable } from "discord.js";
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
  permissions: PermissionResolvable[];
}

export interface CommandExecuteParams {
  ctx: CommandCustomContext;
  bot: LemonTools;
}

export type CommandExecute<T = unknown> = (
  params: CommandExecuteParams
) => Promise<T>;
