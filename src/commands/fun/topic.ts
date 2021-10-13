import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";
import { topics } from "../../data/topics";

export = class Topic extends Command {
  name = "topic";
  disabled? = false;
  description = "Spark a conversation with a random topic";
  usage = "";
  aliases = ["randomtopic", "revivetopic"];
  args = false;
  example = "";
  cooldown = 30_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const embed = this.embed(
      {
        title: `The topic is`,
        description: topics[Math.floor(Math.random() * topics.length)],
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
};
