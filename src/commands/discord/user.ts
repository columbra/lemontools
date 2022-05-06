/**
 * @fileoverview User info command
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new Command(
  {
    name: "user",
    category: "discord",
    description: "Get info about a user",
    options: [
      {
        name: "user",
        type: "USER",
        description: "User to get information about",
        required: true,
      },
    ],
  },
  async ({ ctx, lemontools }) => {
    const user = await lemontools.users.fetch(
      ctx.interaction.options.getUser("user", true),
      {
        force: true,
      }
    );
    const member = await ctx.interaction.guild?.members.fetch(user);
    if (!member)
      return InteractionUtils.userError(
        ctx.interaction,
        `User not found. Perhaps the user recetly left this server or isn't in this server?`
      );
    const embed = new LemonToolsEmbed(
      {
        title: `${user.tag}${member.nickname ? ` (${member.nickname})` : ""}`,
        thumbnail: {
          url: user.displayAvatarURL({ dynamic: true }),
        },
        fields: [
          {
            name: "Downloads",
            value: `[**Avatar (2048px)**](${user.displayAvatarURL({
              dynamic: true,
              format: "png",
              size: 2048,
            })})
            ${
              user.banner
                ? `[**Banner (4096px)**](${user.bannerURL({
                    dynamic: true,
                    format: "png",
                    size: 4096,
                  })})`
                : ""
            }`,
            inline: true,
          },
          {
            name: `Member Joined`,
            value: `<t:${Math.floor(
              member.joinedTimestamp! / 1000
            )}:F> which was <t:${Math.floor(
              member.joinedTimestamp! / 1000
            )}:R>`,
            inline: true,
          },
          {
            name: "Highest Role",
            value: `${member.roles.highest}`,
            inline: true,
          },
          {
            name: "Account Creation",
            value: `<t:${Math.floor(
              user.createdAt.getTime() / 1000
            )}:F> which was <t:${Math.floor(
              user.createdAt.getTime() / 1000
            )}:R>`,
            inline: true,
          },
        ],
      },
      ctx.interaction.user
    );
    ctx.reply(new Reply(embed));
  }
);
