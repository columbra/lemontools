/**
 * @fileoverview Command Listener
 * @since v3.0.0
 */

import CommandCustomContext from "../../classes/commands/CommandCustomContext";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import EventListener from "../../classes/events/EventListener";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new EventListener(
  "interactionCreate",
  ({ lemontools }, interaction) => {
    if (!interaction.isCommand()) return;
    const command = lemontools.Commands.commands.get(interaction.commandName);
    if (!command)
      return InteractionUtils.standardError(
        interaction,
        "Command not found",
        ErrorCodes.COMMAND_NOT_FOUND
      );
    if (command.opts.reqs?.permissions) {
      if (!interaction.memberPermissions?.has(command.opts.reqs.permissions))
        return InteractionUtils.standardError(
          interaction,
          "You don't have the required permissions",
          ErrorCodes.YOU_NO_PERMISSION
        );
    }

    command
      .execute({
        ctx: new CommandCustomContext(lemontools, interaction),
        lemontools,
      })
      .catch((err) =>
        lemontools.Logger.log(
          "error",
          "CommandExecute",
          `Error executing command ${command.opts.name}. ${err}`
        )
      );
  }
);
