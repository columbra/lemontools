import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
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
        }\n\n**About:**\n${
          config.name
        } is a multi-use tools bot, which has a multitude of features not covered by other bots, such as QR Code creation, conversation starters and much, much more. Invite me to your servers today! Invite: **[Link](${this.bot.generateInvite(
          {
            scopes: ["bot", "applications.commands"],
            permissions: new Permissions(448928796608n),
          }
        )})**`,
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
};
