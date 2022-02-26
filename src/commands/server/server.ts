import Command from "../../classes/Command";
import { embed } from "../../util/embed";
import { capitalise } from "../../util/strings";

export default new Command({
  name: "serverinfo",
  description: "Fetch information about this server",
  category: "server",
  perms: [],
  options: [],
  async execute({ bot, args, ctx }) {
    await ctx.deferReply();
    const { guild } = ctx;
    const em = embed(
      {
        title: guild.name,
        thumbnail: {
          url: guild.iconURL(),
        },
        fields: [
          {
            name: "Owner",
            value: (await bot.users.fetch(guild.ownerId)).tag,
          },
          {
            name: "Members",
            value: guild.memberCount.toString(),
          },
          {
            name: "Channels",
            value: (await guild.channels.fetch()).size.toString(),
          },
          {
            name: "Roles",
            value:
              (
                await guild.roles.fetch().catch(() => null)
              )?.size?.toString?.() ?? "No permission to see roles",
          },
          {
            name: "Created",
            value: `<t:${Math.round(guild.createdAt.getTime() / 1_000)}:F>`,
          },
          {
            name: "Verification Level",
            value: capitalise(
              guild.verificationLevel.toLowerCase().replaceAll("_", " ")
            ),
          },
          {
            name: "ID",
            value: guild.id,
          },
        ],
      },
      ctx,
      bot
    );
    ctx.editReply({
      embeds: [em],
    });
  },
});
