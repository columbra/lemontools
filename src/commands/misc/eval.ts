import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import { Command } from "../../interfaces/Command";
import * as config from "../../../config.json";

export = class Evaluate extends Command {
  name = "eval";
  disabled? = false;
  description = "Internal Command, do not use!";
  usage = "";
  aliases = ["newfunction", "evaluate"];
  args = false;
  example = "";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt.setName("js").setDescription("Javascript to eval").setRequired(true)
    );
  sudo = true;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const funct = new Function(
      interaction.options.getString("js") ??
        "return new Error('Somethign went wrong')"
    );
    try {
      const ret = funct.bind(interaction)();
      interaction.reply(`Success! Returned \`\`\`${ret}\`\`\``);
    } catch (err) {
      interaction.reply(`error! ${err}`);
    }
  };
};
