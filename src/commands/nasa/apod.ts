import Command from "../../classes/Command";
import { ApodResponse } from "../../typings/nasa/apod";
import { embed, errorMessage } from "../../helper/util/embed";
import { getJSON } from "../../helper/util/web";

export default new Command({
  name: "apod",
  description: "Get NASA's Astronomy Picture of the Day (APOD)",
  category: "nasa",
  perms: [],
  async execute({ ctx, bot }) {
    await ctx.deferReply();
    try {
      const { data } = await getJSON<ApodResponse>(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA}`
      );
      await ctx.editReply({
        embeds: [
          embed(
            {
              title: data.title,
              image: {
                url: data.hdurl,
              },
              description: `${data.explanation}\nImage: © Copyright ${data.copyright}`,
            },
            ctx,
            bot
          ),
        ],
      });
    } catch {
      ctx.editReply(
        errorMessage(
          "Something went wrong trying to get the APOD. Try again later."
        )
      );
    }
  },
});
