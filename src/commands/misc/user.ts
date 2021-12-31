import Command from "../../classes/Command";
import { embed } from "../../util/embed";

export default new Command({
  name: "user",
  description: "Get information about a user",
  category: "misc",
  perms: [],
  usage: "<user>",
  example: "@Windows95",
  options: [
    {
      name: "user",
      description: "User to find info about",
      type: "USER",
      required: true,
    },
  ],

  async execute({ ctx, bot, args }) {
    await ctx.deferReply()
    const user = await args.getUser("user").fetch();
    const em = embed(
      {
        title: `Information about ${user.username}`,
        fields: [
          {
            name: "Username",
            value: `${user} \`${user.tag}\``,
            inline: true,
          },
          {
            name: "Account Creation",
            value: `<t:${Math.floor(
              user.createdTimestamp / 1000
            )}:R> (<t:${Math.floor(user.createdTimestamp / 1000)}:F>)`,
            inline: true,
          },
          {
            name: "Profile",
            value: `Avatar: [128px](${user.avatarURL({
              dynamic: true,
              size: 128,
            })}) [512px](${user.avatarURL({
              dynamic: true,
              size: 512,
            })}) [4096px 4K](${user.avatarURL({
              dynamic: true,
              size: 4096,
            })})\nBanner: [512px](${user.bannerURL({
              dynamic: true,
              size: 512,
            })}) [4096px 4K](${user.bannerURL({
              dynamic: true,
              size: 4096,
            })})`,
            inline: true,
          },
        ],
        thumbnail: {
          url: user.avatarURL(),
        },
      },
      ctx,
      bot
    );
    ctx.editReply({ embeds: [em] });
  },
});
