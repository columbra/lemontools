import { ApplicationCommand, PermissionResolvable } from "discord.js";
import { CommandOptions, ExecuteFunction } from "../typings/CommandItems";

export default class Command implements CommandOptions {
  sudo: boolean;
  perms: PermissionResolvable[];
  execute: ExecuteFunction;
  description: string;
  name: string;
  example?: string;
  category: string;
  options?: CommandOptions["options"];
  constructor(opt: CommandOptions) {
    Object.assign(this, opt);
  }
}
