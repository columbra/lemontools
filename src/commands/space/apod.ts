import Apod from "../../api/nasa/apod";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new Command(
  {
    name: "apod",
    description: "Get the Astronomy Picture of the Day from NASA",
    category: "space",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    await ctx.interaction.deferReply();
    try {
      const apod = await Apod.get();

      return ctx.edit(
        new Reply(new LemonToolsEmbed(apod, ctx.interaction.user))
      );
    } catch (e) {
      lemontools.Logger.log("error", "APOD", `Error fetching apod ${e}`);
      return ctx.edit(
        new Reply(
          InteractionUtils.standaloneStdError(
            `Sorry, but the Astronomy Picture of the Day is not avaliable right now.`,
            ErrorCodes.EXTERNAL_API_ERROR
          )
        )
      );
    }
  }
);
