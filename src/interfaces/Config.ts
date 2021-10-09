import { Snowflake } from "discord.js";
export interface Config {
  name: string;
  author: string;
  sudos: string[] | Snowflake[];
  production: boolean
  testServer: Snowflake | string
}
