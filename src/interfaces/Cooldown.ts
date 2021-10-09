import { Snowflake } from "discord.js";

export interface Cooldown {
  user: Snowflake | string;
  command: string;
  until: Date;
}
