import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";
import { inviteRow } from "../../static/inviteRow";

export = class Invite extends Command {
  name = "invite";
  disabled? = false;
  description = "Invite the bot";
  usage = "";
  aliases = ["invitation", "vote", "inviteinfo"];
  args = false;
  example = "";
  cooldown = 0;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const embed = this.simpleEmbed(
      "Click on any of the links below to go to that site."
    );

    interaction.reply({ embeds: [embed], components: [inviteRow] });
  };
};
