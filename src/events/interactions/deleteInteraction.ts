import Event from "../../classes/Event";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isButton()) return;
  if (!ctx.customId.includes("delete_")) return;
  ctx.deleteReply().catch((err) => {
    bot.logger.warn(`Error deleting interaction ${ctx.id}, error ${err}`);
  });
});
