/**
 * @fileoverview Fetch information about this server
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import InteractionUtils from "../../utils/interaction/InteractionUtils";
import StringUtils from "../../utils/string/StringUtils";

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
              f("Explicit Content Filter", guild.explicitContentFilter),
              f("AFK Timeout", guild.afkTimeout),
              f(
                "Default Message Notifications",
                guild.defaultMessageNotifications
              ),
              f("MFA Level", guild.mfaLevel),
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
