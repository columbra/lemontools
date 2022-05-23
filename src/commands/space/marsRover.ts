import MarsRovers, { Rovers } from "../../api/nasa/marsRovers";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new Command(
  {
    name: "marsrover",
    description: "Get a random photo taken by a Mars Rover",
    category: "space",
    options: [
      {
        name: "rover",
        type: "STRING",
        required: true,
        description: "The rover to get a photo from",
        choices: [
          {
            name: "Curiosity",
            value: "curiosity",
          },
          {
            name: "Opportunity",
            value: "opportunity",
          },
          {
            name: "Spirit",
            value: "spirit",
          },
        ],
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    await ctx.interaction.deferReply();
    try {
      const photos = await MarsRovers.search(
        ctx.interaction.options.getString("rover", true) as Rovers
      );
      const photo = photos[Math.floor(Math.random() * photos.length)];

      return ctx.edit(
        new Reply(
          new LemonToolsEmbed(
            {
              author: {
                name: photo.rover,
              },
              image: {
                url: photo.src,
              },
            },
            ctx.interaction.user
          )
        )
      );
    } catch (e) {
      lemontools.Logger.log("error", "APOD", `Error fetching apod ${e}`);
      return ctx.edit(
        new Reply(
          InteractionUtils.standaloneStdError(
            `Sorry, but the Mars Rover API is not avaliable right now.`,
            ErrorCodes.EXTERNAL_API_ERROR
          )
        )
      );
    }
  }
);
