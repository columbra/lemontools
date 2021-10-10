import { ClientEvents, CommandInteraction } from "discord.js";
import { Cooldown } from "../interfaces/Cooldown";
import { Event } from "../interfaces/Event";

export default class InteractionCreate extends Event {
  event = "interactionCreate" as keyof ClientEvents;
  execute = async (Ainteraction: CommandInteraction[]) => {
    const [interaction] = Ainteraction;
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
    let cooldownData: Cooldown | undefined;
    this.bot.cooldowns.get(command.name)?.forEach((v) => {
      if (v.user === interaction.user.id) cooldownData = v;
    });
    if (cooldownData) {
      return interaction.reply({
        ephemeral: true,
        embeds: [
          this.embed(
            {
              title: `Sorry, you're on cooldown`,
              description: `Sorry ${
                interaction.user.tag
              }, you are on cooldown for the command ${commandName}! You can run this command again <t:${Math.round(
                cooldownData.until.getTime() / 1000
              )}:R>`,
            },
            interaction
          ),
        ],
      });
    }
    command
      .execute(interaction)
      .then(() => {
        const cooldowns = this.bot.cooldowns.get(command.name);
        const cdd = {
          until: new Date(Date.now() + command.cooldown),
          user: interaction.user.id,
        } as Cooldown;
        if (!cooldowns) {
          this.bot.cooldowns.set(command.name, [cdd]);
        } else {
          this.bot.cooldowns.set(command.name, [...cooldowns, cdd]);
        }
      })
      .catch((err) => {
        interaction.reply({
          ephemeral: true,
          content: `Whoops! Something went wrong when executing that command.`,
        });
        this.bot.logger.error(`Command ${commandName} failed!\nError: ${err}`);
      });
  };
}
