import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import request from "request";
import { Command } from "../../interfaces/Command";

export = class Mars extends Command {
  name = "mars";
  disabled? = false;
  description = "Fetch some photos taken on Mars by NASA's astronomy rovers";
  usage = "";
  aliases = ["marsrover", "marsimg"];
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
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${this.rnd(
        1,
        1000
      )}&api_key=${process.env.NASA_API}`,
      {
        json: true,
      },
      (err, res, body) => {
        if (err)
          return interaction.editReply({ embeds: [this.errorEmbed(err)] });
        const { photos } = body;
        const photo = photos[Math.floor(Math.random() * photos.length)];
        const embed = this.embed(
          {
            author: { name: "Curiosity Mars Rover" },
            image: { url: photo.img_src },
            fields: [
              {
                name: "Metadata",
                value: `**Taken on Mars day:** ${photo.sol}\n**Photo ID:** ${photo.id}`,
                inline: true,
              },
            ],
          },
          interaction
        );
        interaction.editReply({ embeds: [embed] });
      }
    );
  };
};
