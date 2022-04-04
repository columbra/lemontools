import {
  ChatInputApplicationCommandData,
  CommandInteraction,
  CommandInteractionOptionResolver,
  PermissionResolvable,
} from "discord.js";
import Bot from "../classes/NewBot";

export interface RunOptions {
  bot: Bot;
  ctx: CommandInteraction;
  args: CommandInteractionOptionResolver;
}

export type ExecuteFunction = (options: RunOptions) => Promise<any>;

export type CommandOptions  = {
  sudo?: boolean;
  perms: PermissionResolvable[];
  execute: ExecuteFunction;
  usage?: string;
  example?: string;
  category: string;
} & ChatInputApplicationCommandData;
