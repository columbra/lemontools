import Event from "../../classes/Event";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isAutocomplete()) return;
  const response = bot.AutoCompleterManager.run(ctx);
  if (!response) return;
  ctx.respond(response);
});
