import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import request from "request";
import { Command } from "../../interfaces/Command";

export = class Dog extends Command {
  name = "dog";
  disabled? = false;
  description = "Aww";
  usage = "";
  aliases = ["doggo", "doggy"];
  args = false;
  example = "";
  cooldown = 5_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    request(
      "https://dog.ceo/api/breeds/image/random",
      { json: true },
      (err, res, body) => {
        const embed = this.embed(
          {
            title: "Random doggo",
            image: {
              url: body.message,
            },
          },
          interaction
        );
        interaction.editReply({ embeds: [embed] });
      }
    );
  };
};
