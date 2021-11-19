import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export = class Invite extends Command {
  name = "invite";
  disabled? = false;
  description = "Invite the bot";
  usage = "";
  aliases = ["invitation", "vote"];
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
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setStyle("LINK")
        .setURL("https://top.gg/bot/896309687136436234")
        .setLabel("Vote"),
      new MessageButton()
        .setStyle("LINK")
        .setURL(
          "https://discord.com/oauth2/authorize?client_id=896309687136436234&scope=bot+applications.commands&permissions=448928796608"
        )
        .setLabel("Invite"),
    ]);
    interaction.reply({ embeds: [embed], components: [row] });
  };
};
