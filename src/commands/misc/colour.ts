import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment, Permissions } from "discord.js";
import { Command } from "../../interfaces/Command";
import { Canvas } from "canvas";

const regex = /#?((?:[a-f\d]{3}){1,2})/gi;

export = class Colour extends Command {
  name = "colour";
  disabled? = false;
  description = "Visualise a hex code";
  usage = "<hex code>";
  aliases = ["color", "visualcolour"];
  args = true;
  example = "#ffffff";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setName("colour")
        .setDescription("Colour to visualise")
        .setRequired(true)
    );
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const colour = interaction.options.getString("colour");
    if (!colour)
      return interaction.reply({
        ephemeral: true,
        content: "Specify a colour please",
      });
    if (!regex.test(colour))
      return interaction.reply({
        ephemeral: true,
        content: "Please specify a valid hex code!",
      });

    if (!colour.startsWith("#"))
      return interaction.reply({
        ephemeral: true,
        content: "Hex code must begin with pound (#) sign!",
      });
    const canvas = new Canvas(2048, 2048);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const buf = canvas.toBuffer();
    const attatchment = new MessageAttachment(buf, "att.png");
    interaction.reply({ files: [attatchment] });
  };
};
