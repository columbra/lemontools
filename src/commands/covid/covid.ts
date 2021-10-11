import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";
import https from "https";

import humanFormat from "human-format";

export = class Covid extends Command {
  name = "covid";
  disabled? = false;
  description = "Fetch Coronavirus information for your country";
  usage = "<type>";
  aliases = ["covid-19", "coronavirus", "corona"];
  args = true;
  example = "all";
  cooldown = 60_000;
  category = "covid";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Type of data to fetch")
        .setRequired(true)
        .addChoices([
          ["all", "all"],
          ["australia", "countries/aus"],
          ["usa", "countries/usa"],
          ["israle", "countries/isr"],
          ["china", "countries/chn"]
        ])
    );
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const url = `/v3/covid-19/${interaction.options.getString("type")}`;
    const httpsOpts = {
      hostname: "disease.sh",
      port: 443,
      path: url,
      method: "GET",
    };
    https.get(httpsOpts, (res) => {
      const chunks: any[] = [];
      res
        .on("data", (buffer) => {
          chunks.push(buffer);
        })
        .on("end", () => {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          const { updated, cases, todayCases, todayDeaths, deaths } = data;
          const embed = this.embed(
            {
              title: "🦠 Coronavirus Data",
              author: { name: "Fetched from disease.sh" },
              description: `Fetched <t:${Math.floor(
                Date.now() / 1000
              )}:R>. Data was last updated <t:${Math.round(
                updated / 1000
              )}:R>. \n\n*Disclaimer:* Whilst we try to get the latest data, please note that Coronavirus data may not always be accurate. Contact your local authorities for more information about Coronvirus. If you have any symptoms, get tested right away`,
              fields: [
                {
                  name: `Cases`,
                  value: `**Today:** ${humanFormat(
                    todayCases
                  )}\n**Total:** ${humanFormat(cases)}`,
                  inline: true,
                },
                {
                  name: `Deaths`,
                  value: `**Today:** ${humanFormat(
                    todayDeaths
                  )}\n**Total:** ${humanFormat(deaths)}`,
                  inline: true,
                },
                {
                  name: `Metadata`,
                  value: `**Country:** ${interaction.options.getString(
                    "type"
                  )}`,
                  inline: true,
                },
              ],
            },
            interaction
          );
          interaction.editReply({ embeds: [embed] });
        });
    });
  };
};
