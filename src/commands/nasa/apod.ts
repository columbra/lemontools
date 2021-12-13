import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import axios from "axios";
import { Command } from "../../interfaces/Command";

export = class APOD extends Command {
  name = "apod";
  disabled? = false;
  description = "Fetch the Astronomy Pictrue of the Day from NASA";
  usage = "";
  aliases = ["npod", "astronomypictureoftheday"];
  args = false;
  example = "";
  cooldown = 120_000; // 2 mins
  category = "nasa";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API}`
      )
      .then((res) => {
        const embed = this.embed(
          {
            author: { name: res.data.copyright ?? "NASA" },
            title: "NASA's Astronomy Picture of the Day",
            image: { url: res.data.hdurl },
            description: res.data.explanation,
          },
          interaction
        );
        return interaction.editReply({ embeds: [embed] });
      })
      .catch((err) =>
        interaction.editReply({ embeds: [this.errorEmbed(err)] })
      );
  };
};
