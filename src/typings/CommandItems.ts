import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from "discord.js";
import Bot from "../classes/Bot";

export interface RunOptions {
  bot: Bot;
  ctx: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export type ExecuteFunction = (options: RunOptions) => Promise<any>;

export type CommandType = {
  sudo: boolean;
  perms: PermissionResolvable[];
  execute: ExecuteFunction;
  usage?: string;
  example?: string;
} & ChatInputApplicationCommandData;
