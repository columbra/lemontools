/**
 * @fileoverview Configuration file for LemonTools. Basically a collection of non-secret constants
 * @since v3.0.0
 */

import type { BitFieldResolvable, ClientOptions, IntentsString } from "discord.js";

export default {
  style: {
    colours: {
      primary: "#FEF250",
    },
    name: {
      full: "Lemon Tools",
      short: "Lemon Tools",
    },
  },
  bot: {
    // Intents will take precedence over options specified below
    intents: ["GUILDS", "GUILD_MEMBERS"] as BitFieldResolvable<IntentsString, number>,
    options: {

    } as ClientOptions
  },
} as const;
