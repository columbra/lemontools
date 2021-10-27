import { DJSPoster } from "./structs/DJSPoster";
import { DJSSharderPoster } from "./structs/DJSSharderPoster";

import { BasePoster } from "./structs/BasePoster";

import { PosterOptions } from "./typings";

/**
 * Create an AutoPoster
 * @param token Top.gg Token
 * @param client Your Discord.js/Eris Client or Discord.js ShardingManager
 * @param options Options
 * @example
 * const AutoPoster = require('topgg-autoposter')
 *
 * AutoPoster('topggtoken', client) // that's it!
 */
export function AutoPoster(
  token: string,
  client: any,
  options?: PosterOptions
): BasePoster {
  if (!token) throw new Error("Top.gg token is missing");
  if (!client) throw new Error("Client is missing");
  let DiscordJS;
  try {
    DiscordJS = require.cache[require.resolve("discord.js")];
  } catch (err) {}

  let Eris;
  try {
    Eris = require.cache[require.resolve("eris")];
  } catch (err) {}

  let DR;
  try {
    DR = require.cache[require.resolve("discord-rose")];
  } catch (err) {}

  if (DiscordJS && client instanceof DiscordJS.exports.Client)
    return new DJSPoster(token, client, options);
  if (DiscordJS && client instanceof DiscordJS.exports.ShardingManager)
    return new DJSSharderPoster(token, client, options);

  throw new Error("Unsupported client");
}

export { DJSPoster } from "./structs/DJSPoster";
export { DJSSharderPoster } from "./structs/DJSSharderPoster";

export default AutoPoster;
