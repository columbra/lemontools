import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class Random extends Command {
  name = "random";
  disabled? = false;
  description = "Generate a random number";
  usage = "<min> <max>";
  aliases = ["rnd", "rand"];
  args = true;
  example = "1 10";
  cooldown = 1_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addNumberOption((opt) =>
      opt
        .setName("min")
        .setDescription("Minimum number to generate (included)")
        .setRequired(true)
    )
    .addNumberOption((opt) =>
      opt
        .setName("max")
        .setDescription("Maximum number to generate (included)")
        .setRequired(true)
    );
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const crazy = Number.MAX_SAFE_INTEGER;
    const min = interaction.options.getNumber("min");
    const max = interaction.options.getNumber("max");
    if (min === null || max === null)
      return interaction.reply({
        embeds: [this.errorEmbed("You must fill in all the fields!")],
      });
    if (min <= 0 || max <= 0)
      return interaction.reply({
        embeds: [this.errorEmbed("Number must be above zero")],
      });
    if (min === max)
      return interaction.reply({
        embeds: [this.errorEmbed("Number must not equal each other")],
      });
    if (min > max)
      return interaction.reply({
        embeds: [this.errorEmbed("Maximum must be above minimum")],
      });
    if (min > crazy || max > crazy)
      return interaction.reply({
        embeds: [
          this.errorEmbed(
            "Maximum integer size execeeded! 9007199254740991 is the largest number permitted!"
          ),
        ],
      });
    const num = this.rnd(min as number, max as number);
    interaction.reply({
      embeds: [
        this.embed(
          {
            title: "Your random number is...",
            description: num.toString(),
          },
          interaction
        ),
      ],
    });
  };
};
