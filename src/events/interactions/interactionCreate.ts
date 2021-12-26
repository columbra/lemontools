import { CommandInteractionOptionResolver } from "discord.js";
import Event from "../../classes/Event";
import { errorMessage } from "../../util/embed";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isCommand()) return;
  const { commandName } = ctx;
  const command = bot.commands.get(commandName);
  if (!command)
    return bot.logger.error(
      `Received gateway event for command ${commandName} which does not exist!`
    );
  if (command.sudo && !bot.config.bot.sudos.includes(ctx.user.id))
    return ctx.reply(
      errorMessage(
        `Sorry ${ctx.user}, but you need to be a bot \`sudo\` to do that.`
      )
    );
  if (command.perms.length) {
    if (typeof ctx.member.permissions === "string") return;
    if (!ctx.member.permissions.has(command.perms))
      return ctx.reply(
        errorMessage(
          `Sorry ${
            ctx.user
          }, but you don't have permission to do that! You need the permission(s) ${command.perms
            .map((p) => `\`${p}\``)
            .join(", ")} to execute that command!`
        )
      );
  }
  try {
    command.execute({
      bot,
      ctx,
      args: ctx.options as CommandInteractionOptionResolver,
    });
  } catch (err) {
    bot.logger.error(
      `Command ${commandName} failed to execute with this error: ${err}`
    );
    if (!ctx.replied) return ctx.reply("Something went wrong");
    return ctx.followUp("Something went wrong");
  }
});
