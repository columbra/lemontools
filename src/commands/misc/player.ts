import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Interaction, Permissions } from "discord.js";
import got from "got/dist/source";
import { Command } from "../../interfaces/Command";

export = class MinecraftPlayer extends Command {
  name = "mcplayer";
  disabled? = false;
  description = "Get Minecraft player info";
  usage = "<player>";
  aliases = ["minecraftplayer", "mcp"];
  args = true;
  example = "JimBoi2K";
  cooldown = 5_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setDescription("In game name of player to look up")
        .setName("player")
        .setRequired(true)
    );
  sudo = false;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const player = ctx.options.getString("player");

    if (!player) return ctx.reply("Player is required!");
    const mojangURL = `https://api.mojang.com/users/profiles/minecraft/${player}`;
    const res = await got(mojangURL);
    if (res.statusCode === 204)
      return ctx.reply(`Player **${player}** does not exist!`);
    const { id: uuid } = JSON.parse(res.body);
    const skin = JSON.parse(
      Buffer.from(
        JSON.parse(
          (
            await got(
              `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`
            )
          ).body
        ).properties[0].value,
        "base64"
      ).toString()
    ).textures;
    const names = JSON.parse(
      (await got(`https://api.mojang.com/user/profiles/${uuid}/names`)).body
    ).map((e: any) => `\`${e.name}\``);
    const embed = this.embed(
      {
        title: `Minecraft Account Info for ${JSON.parse(res.body).name}`,
        image: {
          url: skin.SKIN.url,
        },
        fields: [
          {
            name: "Looks",
            value: `Skin: [**Link**](${skin.SKIN.url})\n${
              skin.CAPE ? `Cape: [**Link**](${skin.CAPE.url})` : ""
            }`,
            inline: true,
          },
          {
            name: "All Previous Names",
            value: `Earlier names\n${names.join("\n")}\nLater names`,
            inline: true,
          },
          {
            name: "Other Information",
            value: `**UUID:** ${uuid}`,
            inline: true,
          },
        ],
      },
      ctx
    );
    ctx.reply({ embeds: [embed] });
  };
};
