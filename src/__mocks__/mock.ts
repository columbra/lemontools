/**
 * @file Collection of mocks to be used in testing
 * @author Chris-Bitler @Chris-Bitler
 */

import {
  Activity,
  Base,
  CategoryChannel,
  Channel,
  ChannelManager,
  ClientUser,
  ClientVoiceManager,
  DMChannel,
  Emoji,
  Guild,
  GuildAuditLogsEntry,
  GuildChannel,
  GuildChannelManager,
  GuildEmoji,
  GuildEmojiManager,
  GuildEmojiRoleManager,
  GuildManager,
  GuildMember,
  GuildMemberManager,
  GuildMemberRoleManager,
  GuildPreview,
  GuildPreviewEmoji,
  Integration,
  Message,
  MessageAttachment,
  MessageManager,
  MessageReaction,
  NewsChannel,
  PartialGroupDMChannel,
  Presence,
  PresenceManager,
  ReactionEmoji,
  ReactionManager,
  ReactionUserManager,
  RoleManager,
  StoreChannel,
  Team,
  TeamMember,
  TextChannel,
  User,
  UserManager,
  VoiceChannel,
  VoiceRegion,
  VoiceState,
  VoiceStateManager,
  Webhook,
  WebhookClient,
} from "discord.js";
import { Bot } from "../client/Client";

export const MockActivity = Activity as jest.Mock<Activity>;
export const MockBase = Base as jest.Mock<Base>;
export const MockCategoryChannel =
  CategoryChannel as jest.Mock<CategoryChannel>;
export const MockChannel = Channel as jest.Mock<Channel>;
export const MockChannelManager = ChannelManager as jest.Mock<ChannelManager>;
export const MoockClientUser = ClientUser as jest.Mock<ClientUser>;
export const MockClientVoiceManager =
  ClientVoiceManager as jest.Mock<ClientVoiceManager>;
export const MockDMChannel = DMChannel as jest.Mock<DMChannel>;
export const MockEmoji = Emoji as jest.Mock<Emoji>;
export const MockGuild = Guild as jest.Mock<Guild>;
export const MockGuildAuditLogEntry =
  GuildAuditLogsEntry as jest.Mock<GuildAuditLogsEntry>;
export const MockGuildChannel = GuildChannel as jest.Mock<GuildChannel>;
export const MockGuildChannelManager =
  GuildChannelManager as jest.Mock<GuildChannelManager>;
export const MockGuildEmoji = GuildEmoji as jest.Mock<GuildEmoji>;
export const MockGuildEmojiManager =
  GuildEmojiManager as jest.Mock<GuildEmojiManager>;
export const MockGuildEmojiRoleManager =
  GuildEmojiRoleManager as jest.Mock<GuildEmojiRoleManager>;
export const MockGuildManager = GuildManager as jest.Mock<GuildManager>;
export const MockGuildMember = GuildMember as jest.Mock<GuildMember>;
export const MockGuildMemberManager =
  GuildMemberManager as jest.Mock<GuildMemberManager>;
export const MockGuildMemberRoleManager =
  GuildMemberRoleManager as jest.Mock<GuildMemberRoleManager>;
export const MockGuildPreview = GuildPreview as jest.Mock<GuildPreview>;
export const MockGuildPreviewEmoji =
  GuildPreviewEmoji as jest.Mock<GuildPreviewEmoji>;
export const MockIntegration = Integration as jest.Mock<Integration>;
export const MockMessage = Message as jest.Mock<Message>;
export const MockMessageAttachment =
  MessageAttachment as jest.Mock<MessageAttachment>;
export const MockMessageManager = MessageManager as jest.Mock<MessageManager>;
export const MockMessageReaction =
  MessageReaction as jest.Mock<MessageReaction>;
export const MockNewsChannel = NewsChannel as jest.Mock<NewsChannel>;
export const MockPartialGroupDMChannel =
  PartialGroupDMChannel as jest.Mock<PartialGroupDMChannel>;
export const MockPresence = Presence as jest.Mock<Presence>;
export const MockPresenceManager =
  PresenceManager as jest.Mock<PresenceManager>;
export const MockReactionEmoji = ReactionEmoji as jest.Mock<ReactionEmoji>;
export const MockReactionManager =
  ReactionManager as jest.Mock<ReactionManager>;
export const MockReactionUserManager =
  ReactionUserManager as jest.Mock<ReactionUserManager>;
export const MockRoleManager = RoleManager as jest.Mock<RoleManager>;
export const MockStoreChannel = StoreChannel as jest.Mock<StoreChannel>;
export const MockTeam = Team as jest.Mock<Team>;
export const MockTeamMember = TeamMember as jest.Mock<TeamMember>;
export const MockTextChannel = TextChannel as jest.Mock<TextChannel>;
export const MockUser = User as jest.Mock<User>;
export const MockUserManager = UserManager as jest.Mock<UserManager>;
export const MockVoiceChannel = VoiceChannel as jest.Mock<VoiceChannel>;
export const MockVoiceRegion = VoiceRegion as jest.Mock<VoiceRegion>;
export const MockVoiceState = VoiceState as jest.Mock<VoiceState>;
export const MockVoiceStateManager =
  VoiceStateManager as jest.Mock<VoiceStateManager>;
export const MockWebhook = Webhook as jest.Mock<Webhook>;
export const MockWebhookClient = WebhookClient as jest.Mock<WebhookClient>;

export const MockBot = Bot as unknown as jest.Mock<Bot>;
