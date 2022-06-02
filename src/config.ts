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
      danger: "#F40404",
    },
    name: {
      full: "Lemon Tools",
      short: "Lemon Tools",
    },
    links: {
      supportDiscord: "https://discord.gg/Xn3wcwHnZg",
      // Permissions integer, used to generate invites
      permissions: BigInt(515463564358),
      inviteLink: `https://discord.com/api/oauth2/authorize?client_id=896309687136436234&permissions=515463564358&scope=bot%20applications.commands`,
      website: "https://compositr.dev/lemontools",
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

    sudos: ["330539533546422272"],

    testGuild: "937975082582687784",

    collectors: {
      // Timeout for long collectors to wait for a response
      // Seconds
      longTimeout: 60_000
    }
  },
  diskcache: {
    path: "/tmp/lemontools/cache.json",
    sweepEvery: 10_000, // milliseconds
  },
} as const;
