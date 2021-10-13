import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Command } from "../../interfaces/Command";
import { TopCategories } from "../../interfaces/NYT";

const typeArray = [
  "arts",
  "automobiles",
  "books",
  "business",
  "fashion",
  "food",
  "health",
  "home",
  "insider",
  "magazine",
  "movies",
  "obituaries",
  "opinion",
  "politics",
  "realestate",
  "science",
  "sports",
  "technology",
  "theater",
  "travel",
  "upshot",
  "us",
  "world",
];

export = class NYT extends Command {
  name = "nyt";
  disabled? = false;
  description = "Fetch the latest headlines from the New York Times API";
  usage = "<category>";
  aliases = ["nytheadlines", "fetchnews", "newyorktimes"];
  args = true;
  example = "politics";
  cooldown = 5_000;
  category = "news";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setName("category")
        .setDescription("Category of headlines to fetch")
        .setRequired(true)
        .addChoices(typeArray.map((e) => [e, e]))
    );
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    await interaction.deferReply()
    const category = interaction.options.getString("category");
    const data = await this.getNYTData(
      category as TopCategories,
      process.env.NYT_API as string
    );
    // console.log("data", data)
    const headline = data[Math.floor(Math.random() * data.length)];
    const [image] = headline.multimedia;
    const embed = this.embed(
      {
        author: {
          name: `${headline.byline}`,
          url: "https://developer.nytimes.com"
        },
        thumbnail: {
          height: 65,
          width: 65,
          url: "https://developer.nytimes.com/files/poweredby_nytimes_65b.png?v=1583354208346",
        },
        title: headline.title,
        url: headline.url,
        description: `${headline.abstract}\n\nPowered by the [**New York Times**](https://developer.nytimes.com)\n\n\n**[Link](${headline.short_url})** | Image: ${image.copyright}`,
        image: { height: image.height, width: image.width, url: image.url },
      },
      interaction
    ); 
    interaction.editReply({embeds: [embed]})
  };
};
