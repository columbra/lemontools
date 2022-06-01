/**
 * @fileoverview Fetch information about this server
 * @since v3.0.0
 */

import type { Guild } from "discord.js";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import InteractionUtils from "../../utils/interaction/InteractionUtils";
import StringUtils from "../../utils/string/StringUtils";
import ms from "ms"

const explicitDict: { [key in Guild["explicitContentFilter"]]: string } = {
  ALL_MEMBERS: "Checking messages sent by all members",
  DISABLED: "Disabled",
  MEMBERS_WITHOUT_ROLES: "Checking messages from members without roles",
};

const defaultNotifsDict: { [key in Guild["defaultMessageNotifications"]]: string } = {
  ALL_MESSAGES: "All messages",
  ONLY_MENTIONS: "Only mentions"
};

const mfaDict: { [key in Guild["mfaLevel"]]: string } = {
  ELEVATED: "MFA required for moderation",
  NONE: "Disabled"
};

export default new Command(
  {
    name: "server",
    description: "Fetch details about this server",
    category: "discord",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    const {
      interaction: { guild: guild },
    } = ctx;

    if (guild === null)
      return InteractionUtils.standardError(
        ctx.interaction,
        `No server found`,
        ErrorCodes.MISSING_COMMAND_CONTEXT
      );
    return ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            title: guild.name,
            thumbnail: {
              // Requires undefined, iconURL returns null
              url: guild.iconURL({ dynamic: true }) ?? undefined,
            },
            fields: [
              f("Owner", `<@${guild.ownerId}>`),
              f("Members", guild.memberCount),
              // f("Roles", guild.roles.cache.size),
              // f("Emojis", guild.emojis.cache.size),
              f(
                "Verification Level",
                StringUtils.capitialise(guild.verificationLevel.toLowerCase())
              ),
              f(
                "Explicit Content Filter",
                explicitDict[guild.explicitContentFilter]
              ),
              // seconds to ms
              f("AFK Timeout", ms((guild.afkTimeout * 1000))),
              f(
                "Default Message Notifications",
                defaultNotifsDict[guild.defaultMessageNotifications]
              ),
              f("Multi-Factor Authentication (MFA)", mfaDict[guild.mfaLevel]),
            ],
          },
          ctx.interaction.user
        )
      )
    );
  }
);

function f(name: string, value: string | number) {
  return {
    name,
    value: value.toString(),
  };
}
