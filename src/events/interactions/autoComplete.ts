import Event from "../../classes/Event";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isAutocomplete()) return;
  bot.logger.verbose(
    `EventManager/Child: autoCompleteInteraction received from ${ctx.user.tag} (${ctx.user.id})`
  );
  const response = bot.AutoCompleterManager.run(ctx);
  ctx.respond(response || []);
});
