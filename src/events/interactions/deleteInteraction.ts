import { Message } from "discord.js";
import Event from "../../classes/Event";
import { epherrf } from "../../util/embed";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isButton()) return;
  if (ctx.customId !== "delete") return;
  if (ctx.user.id !== ctx.message.author.id)
    return ctx.reply(epherrf("You can only delete your own interactions."));
  await (ctx.message as Message).delete().catch((err) => {
    bot.logger.warn(`Error deleting interaction ${ctx.id}, error ${err}`);
  });
  ctx.reply(epherrf("Interaction deleted."));
});
