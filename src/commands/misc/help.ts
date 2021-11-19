import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageEmbed,
  Collection,
  EmbedFieldData,
} from "discord.js";
import * as config from "../../../config.json";

export = class Help extends Command {
  name = "help";
  disabled? = false;
  description =
    "List my commands or get some more information about a specific command";
  usage = "[command]";
  aliases = ["helps", "halp"];
  args = true;
  example = "info";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt.setName("command").setDescription("Command to look up")
    );
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const query = interaction.options.getString("command");
    if (!query) {
      const fields: EmbedFieldData[] = [...this.bot.categories].map((val) => {
        return {
          name: `${this.capitalise(val)} • **[${
            this.bot.commands.filter(
              (cmd) => cmd.category.toLowerCase() === val.toLowerCase()
            ).size
          }]**`,
          value: this.bot.commands
            .filter((cmd) => cmd.category.toLowerCase() === val.toLowerCase())
            .map((cmd) => `\`${cmd.name}\``)
            .join("\n"),
          inline: true,
        };
      });
      interaction.reply({
        embeds: [
          this.embed(
            {
              title: `All commands for ${config.name}`,
              fields,
              description: `${this.bot.commands.size} commands in total`,
            },
            interaction
          ),
        ],
      });
    } else {
      const command = this.bot.commands.get(query);
      if (!command)
        return interaction.reply({
          ephemeral: true,
          embeds: [this.simpleEmbed(`Command **${query}** does not exist!`)],
        });
      const fields: EmbedFieldData[] = [];
      if (command.args)
        fields.push({
          name: `How to use`,
          value: `**Usage:** /${command.name} ${command.usage}\n**Example:** /${command.name} ${command.example}`,
          inline: true,
        });
      if (command.aliases?.length)
        fields.push({
          name: `Aliases`,
          value: `\`${command.aliases.join(", ")}\``,
          inline: true,
        });
      if (command.perms.length)
        fields.push({
          name: `Perms Required`,
          value: `${command.perms.map((e) => `\`${e}\``).join("\n")}`,
        });
      if (fields.length) {
        interaction.reply({
          embeds: [
            this.embed(
              {
                title: `${command.name}`,
                description: `${command.description}${
                  command.sudo ? "\n\n**Command is `BOT_OWNER` only!**" : ""
                }`,
                fields,
              },
              interaction
            ),
          ],
        });
      } else {
        interaction.reply({
          embeds: [
            this.embed(
              {
                title: `${command.name}`,
                description: command.description,
              },
              interaction
            ),
          ],
        });
      }
    }
  };
};
