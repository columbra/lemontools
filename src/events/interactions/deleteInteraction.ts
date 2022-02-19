import Event from "../../classes/Event";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isButton()) return;
  if (ctx.customId !== "delete") return;
  ctx.deleteReply().catch((err) => {
    bot.logger.warn(`Error deleting interaction ${ctx.id}, error ${err}`);
  });
});
