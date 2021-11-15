import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class TimeDiff extends Command {
  name = "timediff";
  disabled? = false;
  description = "Calculate the difference between two dates";
  usage = "<date 1> <date 2>";
  aliases = ["timed", "timedifference"];
  args = true;
  example = "2021 Nov 11 2020";
  cooldown = 1_000;
  category = "time";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt.setName("firstdate").setDescription("First date").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("seconddate").setDescription("Second date").setRequired(true)
    );
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const firstDate = interaction.options.getString("firstdate");
    const secondDate = interaction.options.getString("seconddate");
    if (!firstDate || !secondDate)
      return interaction.reply(
        this.eph("Missing date values! Date is required!")
      );
    const firstTimestamp = new Date(firstDate);
    const secondTimestamp = new Date(secondDate);
    if (isNaN(firstTimestamp.getTime()) || isNaN(secondTimestamp.getTime()))
      return interaction.reply(
        this.eph("One of the dates provided was invalid!")
      );
    const diff = Math.round(
      secondTimestamp.getTime() - firstTimestamp.getTime()
    );
    const embed = this.embed(
      {
        description: `First Date: <t:${Math.round(
          firstTimestamp.getTime() / 1000
        )}:F>\nSecond Date: <t:${Math.round(
          secondTimestamp.getTime() / 1000
        )}:F>\n\nDifference: \`${this.msToTime(diff)}\``,
      },
      interaction
    );
    interaction.reply({ embeds: [embed] });
  };
};
