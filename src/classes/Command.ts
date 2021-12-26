import { PermissionResolvable } from "discord.js";
import { CommandType, ExecuteFunction } from "../typings/CommandItems";

export default class Command implements CommandType {
  sudo: boolean;
  perms: PermissionResolvable[];
  execute: ExecuteFunction;
  description: string;
  name: string;
  usage: string;
  example: string;
  category: string
  constructor(opt: CommandType) {
    Object.assign(this, opt);
  }
}
