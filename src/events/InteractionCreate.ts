import { ClientEvents, CommandInteraction } from "discord.js";
import { Event } from "../interfaces/Event";

export default class InteractionCreate extends Event {
  event = "interactionCreate" as keyof ClientEvents;
  execute = async (Ainteraction: CommandInteraction[]) => {
    const [interaction] = Ainteraction
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const command = this.bot.commands.get(commandName);
    if (!command) {
      const err = new Error(`Command file missing for command ${commandName}`);

      this.bot.logger.error(err);
      return interaction.reply({
        ephemeral: true,
        content: `Whoops! Something went wrong when executing that command.\n**Technical Details:** Stack: ${
          err.stack ?? "No stack found"
        }\nMessage: ${err.message}`,
      });
    }
    command.execute(interaction).catch(err => {
      interaction.reply({ephemeral: true, content: `Whoops! Something went wrong when executing that command.`})
      this.bot.logger.error(`Command ${commandName} failed!\nError: ${err}`)
    })
  };
}
