import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class CoinFlip extends Command {
  name = "coin";
  disabled? = false;
  description = "Flip a virtual coin";
  usage = "";
  aliases = ["flipcoin", "coinflip"];
  args = false;
  example = "";
  cooldown = 1;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const rnd = this.rnd(1, 2);
    interaction.reply(`:coin: You got ${rnd === 1 ? "heads" : "tails"}`);
  };
};
