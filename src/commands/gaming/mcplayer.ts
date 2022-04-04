import Command from "../../classes/Command";
import { MCPlayer } from "../../typings/mcplayer";
import { embed } from "../../helper/util/embed";
import { epherr } from "../../helper/util/strings";
import { getJSON } from "../../helper/util/web";

export default new Command({
  name: "mcplayer",
  description: "Fetch information about a Minecraft Player",
  category: "gaming",
  perms: [],
  options: [
    {
      name: "player",
      description: "Player to look up",
      type: "STRING",
      required: true,
    },
  ],
  example: "JimBoi2K",
  usage: "<player>",
  async execute({ ctx, bot, args }) {
    const player = args.getString("player");
    const { id: uuid } = (
      await getJSON<{
        data: { id: string; name: string };
      }>(`https://api.mojang.com/users/profiles/minecraft/${player}`)
    ).data;
    if (!uuid)
      return ctx.reply(
        epherr`That player doesn't exist or has their account set to private.`
      );
    await ctx.deferReply();
    const { data } = await getJSON<{ data: MCPlayer }>(
      `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
    );
    if (data.error)
      return ctx.editReply(
        epherr`There was an error trying to fetch that player! Try again later...`
      );
    const skinData = Buffer.from(data.properties[0].value, "base64").toString();
    const { textures: skin } = JSON.parse(skinData); // SOMEONE IN MOJANG ENCODED A URL IN BASE64 :facepalm:
    const em = embed(
      {
        title: `${data.name}'s Profile`,
        fields: [
          {
            name: "Profile",
            value: `UUID: \`${data.id}\`
          Name: \`${data.name}\``,
          },
          {
            name: "Looks",
            value: `Skin: [**:arrow_upper_right: Link**](${skin.SKIN.url})\n${
              skin.CAPE
                ? `Cape: [**:arrow_upper_right: Link**](${skin.CAPE.url})`
                : ""
            }`,
          },
        ],
        thumbnail: { url: skin.SKIN.url },
      },
      ctx,
      bot
    );
    ctx.editReply({ embeds: [em] });
  },
});
