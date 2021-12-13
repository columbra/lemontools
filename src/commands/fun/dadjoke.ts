import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import axios from "axios";
import { Command } from "../../interfaces/Command";

export = class DadJoke extends Command {
  name = "dadjoke";
  disabled? = false;
  description = "The worst jokes of em all";
  usage = "";
  aliases = ["icanhazdadjoke", "dadjokes"];
  args = false;
  example = "";
  cooldown = 10_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    axios
      .get("https://icanhazdadjoke.com", {
        headers: {
          Accept: "text/plain",
          "User-Agent":
            "Lemon Tools Discord Bot (https://github.com/cooljim/lemontools)",
        },
      })
      .then((res) => {
        const embed = this.embed(
          {
            title: res.data,
            url: "https://icanhazdadjoke.com",
            description: `Fetched from [icanhazdadjoke](icanhazdadjoke.com)`,
          },
          interaction
        );
        interaction.editReply({ embeds: [embed] });
      });
  };
};
