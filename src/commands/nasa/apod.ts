import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import request from "request";
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
    request(
      "https://api.nasa.gov/planetary/apod?api_key=" + process.env.NASA_API,
      {
        json: true,
      },
      (err, res, body) => {
        if (err)
          return interaction.editReply({ embeds: [this.errorEmbed(err)] });
        const embed = this.embed(
          {
            author: { name: body.copyright ?? "NASA" },
            title: "NASA's Astronomy Picture of the Day",
            image: { url: body.hdurl },
            description: body.explanation,
          },
          interaction
        );
        return interaction.editReply({ embeds: [embed] });
      }
    );
  };
};
