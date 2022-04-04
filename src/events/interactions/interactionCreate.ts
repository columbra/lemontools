import { CommandInteractionOptionResolver } from "discord.js";
import Event from "../../classes/Event";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isCommand()) return;
  bot.CommandManager.run(ctx);
});
