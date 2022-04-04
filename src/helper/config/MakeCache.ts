import { Options } from "discord.js";

export default Options.cacheWithLimits({
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
});
