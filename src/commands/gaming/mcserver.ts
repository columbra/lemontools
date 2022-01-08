import Command from "../../classes/Command";
import { MCServer } from "../../typings/mcserver";
import { embed } from "../../util/embed";
import { LemonEmojis } from "../../util/emoji";
import { capitalise } from "../../util/strings";
import { getJSON } from "../../util/web";

export default new Command({
  name: "mcserver",
  category: "gaming",
  description: "Check the status of a Minecraft Server",
  perms: [],
  options: [
    {
      name: "server",
      description: "Server IP to look up",
      type: "STRING",
      required: true,
    },
  ],
  example: "hypixel.net",
  usage: "<ip>",

  async execute({ bot, ctx, args }) {
    await ctx.deferReply();
    const { data } = await getJSON<{ data: MCServer }>(
      `https://api.mcsrvstat.us/2/${args.getString("server", true)}`
    );
    const em = embed(
      {
        title: `Status for \`${args.getString("server").toLowerCase()}\``,
        fields: [
          {
            name: "Status",
            value: `${data.online ? LemonEmojis.Online : LemonEmojis.Offline} ${
              data.online ? "Online" : "Offline"
            }`,
          },
          {
            name: "MOTD",
            value: `\`\`\`${data.motd.clean.join("\n")}\`\`\``,
          },
          {
            name: "Players",
            value: `Online: \`${data.players.online.toLocaleString()}\`
            Maximum: \`${data.players.max.toLocaleString()}\``,
          },
          {
            name: "Miscellaneous",
            value: `IP Address: \`${data.ip}\`
            Version: \`${data.version}\``,
          },
        ],
        thumbnail: {
          url: `https://api.mcsrvstat.us/icon/${data.hostname}`,
        },
      },
      ctx,
      bot
    );
    ctx.editReply({ embeds: [em] });
  },
});
