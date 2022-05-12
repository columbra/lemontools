/**
 * @fileoverview Flip a virtual coin
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import Emojis from "../../utils/constants/Emojis";

export default new Command(
  {
    name: "coin",
    description: "Flip a virtual coin",
    category: "fun",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    const coin = Math.random() < 0.5 ? "heads" : "tails";
    await ctx.reply(
      new Reply(
        new LemonToolsEmbed({
          description: `${Emojis.COINFLIP} Flipping a coin...`,
        }, ctx.interaction.user)
      )
    );
    setTimeout(() => {
      ctx.edit(
        new Reply(
          new LemonToolsEmbed({
            description: `You got ${coin}!`,
          }, ctx.interaction.user)
        )
      );
    }, 1_500);
  }
);
