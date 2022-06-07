/**
 * @fileoverview Get a random dog, uses the DogCEO api wrapper
 * @since v3.0.0
 */
import DogCEO from "../../api/animal/dogceo";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new Command(
  {
    name: "dog",
    description: "Fetch a random dog picture",
    category: "animals",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    await ctx.interaction.deferReply();

    try {
      const data = await DogCEO.get();
      return ctx.edit(
        new Reply(new LemonToolsEmbed(data, ctx.interaction.user))
      );
    } catch {
      return ctx.edit(
        new Reply(
          InteractionUtils.standaloneStdError(
            `Couldn't fetch a random dog picture. Please try again later!`,
            11
          )
        )
      );
    }
  }
);
