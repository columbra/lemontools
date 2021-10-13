import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageAttachment } from "discord.js";
import { Command } from "../../interfaces/Command";
import { Fun, oneToSix } from "../../static/methods/Fun";

export = class Dice extends Command {
  name = "dice";
  disabled? = false;
  description = "Roll a six sided die";
  usage = "";
  aliases = ["sixsideddice", "dices"];
  args = false;
  example = "";
  cooldown = 1_000;
  category = "fun";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    const img = Fun.drawDice(this.rnd(1, 6) as oneToSix)
    const attatch = new MessageAttachment(
      img, "dice.png"
    );
    interaction.reply({files: [attatch]})
  };
};
