import Command from "../../classes/Command";
import { MCServer } from "../../typings/mcserver";
import { embed } from "../../helper/util/embed";
import { LemonEmojis } from "../../helper/util/emoji";
import { getJSON } from "../../helper/util/web";

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
            value: `\`\`\`${
              data.motd?.clean.join("\n") ?? "No MOTD Found..."
            }\`\`\``,
          },
          {
            name: "Players",
            value: `Online: \`${
              data.players?.online.toLocaleString() ?? "Unknown"
            }\`
            Maximum: \`${data?.players?.max.toLocaleString() ?? "Unknown"}\``,
          },
          {
            name: "Miscellaneous",
            value: `IP Address: \`${data.ip}\`
            Version: \`${data.version ?? "Unknown"}\``,
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
