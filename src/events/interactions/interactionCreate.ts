import { CommandInteractionOptionResolver } from "discord.js";
import Event from "../../classes/Event";
import { epherrf, errorMessage } from "../../util/embed";

export default new Event("interactionCreate", async (bot, ctx) => {
  if (!ctx.isCommand()) return;
  const { commandName } = ctx;
  bot.logger.debug(`Command ${commandName} recieved from gateway.`);
  const command = bot.commands.get(commandName);
  if (ctx.channel.type === "DM" || !ctx.inGuild())
    return ctx.reply(errorMessage("Commands cannot be used in DMs!"));
  if (!command)
    return bot.logger.error(
      `Received gateway event for command ${commandName} which does not exist!`
    );
  if (command.sudo && !bot.config.bot.sudos.includes(ctx.user.id))
    return ctx
      .reply(
        epherrf(
          `Sorry ${ctx.user}, but you need to be a bot \`sudo\` to do that.`
        )
      )
      .catch((err) =>
        bot.logger.error(`Error whilst sending error to user: ${err}`)
      );
  if (command.perms.length) {
    if (typeof ctx.member.permissions === "string") return;
    if (!ctx.guild.me.permissions.has(command.perms))
      return ctx
        .reply(
          epherrf(
            `Sorry ${
              ctx.user
            }, but you I don't have permission to do that! I require the permission(s) ${command.perms
              .map((p) => `\`${p}\``)
              .join(", ")} to execute that command!`
          )
        )
        .catch((err) =>
          bot.logger.error(`Error whilst sending error to user: ${err}`)
        );
    if (!ctx.member.permissions.has(command.perms))
      return ctx
        .reply(
          epherrf(
            `Sorry ${
              ctx.user
            }, but you don't have permission to do that! You need the permission(s) ${command.perms
              .map((p) => `\`${p}\``)
              .join(", ")} to execute that command!`
          )
        )
        .catch((err) =>
          bot.logger.error(`Error whilst sending error to user: ${err}`)
        );
  }
  try {
    await command.execute({
      bot,
      ctx,
      args: ctx.options as CommandInteractionOptionResolver,
    });
  } catch (err) {
    bot.logger.error(
      `Command ${commandName} failed to execute with this error: ${err}`
    );
    if (!ctx.replied || !ctx.deferred)
      return ctx
        .reply(errorMessage(`Something went wrong whilst running that command`))
        .catch((err) =>
          bot.logger.error(`Error whilst sending error to user: ${err}`)
        );
    return ctx
      .followUp(
        errorMessage("Something went wrong whilst running that command")
      )
      .catch((err) =>
        bot.logger.error(`Error whilst sending error to user: ${err}`)
      );
  } finally {
    bot.logger.debug(`Command ${commandName} processed`);
  }
});
