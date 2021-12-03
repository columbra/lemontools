import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import request from "request";
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
    request(
      "https://icanhazdadjoke.com/",
      {
        json: false,
        headers: {
          Accept: "text/plain",
          "User-Agent":
            "Lemon Tools DiscordBot (https://cooljim.github.io/lemontools) mailto:jimke2000@gmail.com",
        },
      },
      (err, res, body) => {
        const embed = this.embed(
          {
            title: body,
            url: "https://icanhazdadjoke.com",
            description: `Fetched from [icanhazdadjoke](icanhazdadjoke.com)`,
          },
          interaction
        );
        interaction.editReply({ embeds: [embed] });
      }
    );
  };
};
