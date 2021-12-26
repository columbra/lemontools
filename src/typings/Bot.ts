import { ApplicationCommandDataResolvable } from "discord.js";

export interface CommandRegisterOptions {
  guild?: string;
  commands: ApplicationCommandDataResolvable[];
}
