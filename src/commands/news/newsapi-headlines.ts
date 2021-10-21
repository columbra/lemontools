import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import { NewsAPI } from "../../static/api/newsapi";

export = class Headlines extends Command {
  name = "ausnews";
  disabled? = false;
  description = "Fetch some Australian headlines and news from NewsAPI";
  usage = "<category>";
  aliases = [];
  args = false;
  example = "";
  cooldown = 10_000;
  category = "news";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    NewsAPI.headlines("AU")
      .then((data: any) => {
        const article =
          data.articles[Math.floor(Math.random() * data.articles.length)];
        const date = new Date(article.publishedAt);
        const embed = this.embed(
          {
            title: article.title,
            url: article.url,
            image: { url: article.urlToImage },
            description: `${article.description}\n\n`,
            author: { name: article.author },
            fields: [
              {
                name: "Source",
                value: `**Published by:** ${
                  article.source.name
                }\n**Published ID:** ${
                  article.source.id ?? "Cannot find ID"
                }\n\n**[Powered by News API](https://newsapi.org)**`,
                inline: false,
              },
              {
                name: "Publishing Info",
                value: `**Published at:** <t:${Math.floor(
                  date.getTime() / 1000
                )}:F> (<t:${Math.floor(date.getTime() / 1000)}:R>)`,
                inline: false,
              },
            ],
          },
          interaction
        );
        interaction.editReply({
          embeds: [embed],
          content: `Found **${data.totalResults}** articles, selected one of them.`,
        });
      })
      .catch((err) => this.bot.logger.error(err));
  };
};
