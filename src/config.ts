/**
 * @fileoverview Configuration file for LemonTools. Basically a collection of non-secret constants
 * @since v3.0.0
 */

import type {
  BitFieldResolvable,
  CacheWithLimitsOptions,
  ClientOptions,
  IntentsString,
} from "discord.js";

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
    intents: ["GUILDS", "GUILD_MEMBERS"] as BitFieldResolvable<
      IntentsString,
      number
    >,
    options: {} as ClientOptions,

    cache: {
      MessageManager: 150,
      PresenceManager: 0,
      GuildStickerManager: 0,
      ApplicationCommandManager: 100,
      GuildBanManager: 0,
      GuildMemberManager: 30,
      GuildEmojiManager: 0,
      BaseGuildEmojiManager: 0,
      UserManager: 50,
      GuildInviteManager: 0,
      GuildScheduledEventManager: 0,
      ReactionManager: 0,
      ReactionUserManager: 0,
      ThreadManager: 10,
      VoiceStateManager: 0,
      StageInstanceManager: 0,
      ThreadMemberManager: 10,
    } as CacheWithLimitsOptions,

    logging: {
      config: {
        levels: {
          crit: 0,
          error: 1,
          warn: 2,
          info: 3,
          verbose: 4,
        },
        colors: {
          crit: "bgRed bold white",
          error: "bold red",
          warn: "yellow",
          info: "cyan",
          debug: "magenta bold",
          verbose: "white bold",
        },
      },
    },
  },
} as const;
