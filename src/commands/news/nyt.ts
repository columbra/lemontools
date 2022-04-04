import Command from "../../classes/Command";
import { NYTSectionHeadlines, Result } from "../../typings/nyt";
import { embed } from "../../helper/util/embed";
import { capitalise, epherr } from "../../helper/util/strings";
import { getJSON } from "../../helper/util/web";

const sections = [
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

export default new Command({
  name: "nyt",
  description: "Get a headline from the New York Times",
  category: "news",
  perms: [],

  options: [
    {
      name: "section",
      description: "Headline section to fetch",
      type: "STRING",
      required: true,
      choices: sections.map((s) => ({
        name: capitalise(s),
        value: s,
      })),
    },
  ],
  example: "Technology",

  async execute({ ctx, args, bot }) {
    await ctx.deferReply();
    const section = args.getString("section");
    const { data } = await getJSON<{ data: NYTSectionHeadlines }>(
      `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${process.env.NYT}`
    ).catch(() => null);
    if (!data)
      return ctx.editReply(
        epherr`Something went wrong whilst getting that headline! Please try again!`
      );
    const { results } = data;
    const headline: Result = results[~~Math.random() * results.length];
    if (!headline)
      return ctx.editReply(
        epherr`Something went wrong whilst getting that headline! Please try again!`
      );

    const em = embed(
      {
        title: headline.title,
        description: `${headline.abstract}\n\n[**Link**](${headline.url}) | **Image:** ${headline.multimedia?.[0].copyright}`,
        fields: [
          {
            name: "Article Information",
            value: `Published Date: <t:${~~new Date(
              headline.published_date
            ).getTime()}:F>\nUpdated Date: <t:${~~new Date(
              headline.updated_date
            ).getTime()}:F>`,
          },
        ],
        url: headline.url,
        image: {
          url: headline.multimedia?.[0]?.url,
        },
        author: {
          name: headline.byline,
        },
        thumbnail: {
          url: "https://developer.nytimes.com/files/poweredby_nytimes_65b.png?v=1583354208346",
        },
      },
      ctx,
      bot
    );
    ctx.editReply({ embeds: [em] });
  },
});
