import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";
import * as config from "../../../config.json";

export = class Info extends Command {
  name = "info";
  disabled? = false;
  description = "Get some information about the bot";
  usage = "";
  aliases = ["information", "inform"];
  args = false;
  example = "";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const embed = this.embed(
      {
        title: `Information about ${config.name}`,
        description: `**Created by:** ${
          config.author
        }\n**Language:** TypeScript\n**Production Ready:** ${
          config.production ? "Yes" : "No"
        }`,
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
}
