import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";

const nitro = new Map([
  ["NONE", "No boosts on this server"],
  ["TIER_1", "Level 1 Boost"],
  ["TIER_2", "Level 2 Boost"],
  ["TIER_3", "Level 3 Boost (Maximum)"],
]);

export = class Server extends Command {
  name = "server";
  disabled? = false;
  description = "Fetch information about the server you are currently in";
  usage = "";
  aliases = ["serverinfo", "servers"];
  args = false;
  example = "";
  cooldown = 5_000;
  category = "server";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const { guild } = interaction;
    if (!guild)
      return interaction.reply("You must be in a server to run this command!");
    const embed = this.embed(
      {
        title: `Information about ${guild.name}`,
        description: `**Server description:** ${
          guild.description ?? "No description found"
        }`,
        fields: [
          {
            name: `General Info`,
            value: `**Server created:** <t:${Math.round(
              guild.createdAt.getTime() / 1000
            )}:R>\n**Server name:** ${guild.name}\n**Members:** ${
              guild.memberCount
            }`,
            inline: true,
          },
          {
            name: `Nitro`,
            value: `${nitro.get(guild.premiumTier)}`,
            inline: true,
          },
        ],
        thumbnail: { url: guild.iconURL() ?? undefined },
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
};
