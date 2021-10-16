import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";
const regex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export = class QRCode extends Command {
  name = "qrcode";
  disabled? = false;
  description = "Generate a QRCode to a url";
  usage = "";
  aliases = ["qr-code", "qr"];
  args = false;
  example = "";
  cooldown = 3_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setName("url")
        .setDescription("URL of the website to embed in qr code")
        .setRequired(true)
    );
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const url = interaction.options.getString("url");
    if (!url) return interaction.reply("URL is required!");
    if (!regex.test(url)) return interaction.reply("URL must be a valid url");
    const embed = this.embed(
      {
        title: `QR Code for ${url}`,
        image: {
          url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`,
        },
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
};
