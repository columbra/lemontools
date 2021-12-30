import { AutocompleteInteraction } from "discord.js";
import Event from "../../classes/Event";

export default new Event(
  "interactionCreate",
  async (bot, ctx: AutocompleteInteraction) => {
    if (!ctx.isAutocomplete()) return;
    const autoCompleter = bot.autocomplete.get(ctx.commandName);
    if (!autoCompleter) {
      bot.logger.error(`Autocomplete missing for command ${ctx.commandName}!`);
      return ctx.respond([]);
    }
    const autoComplete = autoCompleter.execute({
      ctx,
      bot,
    });
    ctx.respond(autoComplete);
  }
);
