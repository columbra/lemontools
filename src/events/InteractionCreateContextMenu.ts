import { ClientEvents, CommandInteraction } from "discord.js";
import { Cooldown } from "../interfaces/Cooldown";
import { Event } from "../interfaces/Event";

export default class InteractionCreateContextMenu extends Event {
  event = "interactionCreate" as keyof ClientEvents;
  execute = async (Ainteraction: CommandInteraction[]) => {
    const [interaction] = Ainteraction;
    if (!interaction.isContextMenu()) return;
    const { commandName: contextName } = interaction;
    const context = this.bot.contextMenu.get(contextName);
    if (!context) {
      const err = new Error(
        `ContextMenu file missing for command ${contextName}`
      );
      this.bot.logger.error(err);
      return interaction.reply({
        ephemeral: true,
        content: `Whoops! Something went wrong when executing that command.\n**Technical Details:** Stack: ${
          err.stack ?? "No stack found"
        }\nMessage: ${err.message}`,
      });
    }
    let cooldownData: Cooldown | undefined;
    this.bot.cooldowns.get(context.name)?.forEach((v) => {
      if (v.user === interaction.user.id) cooldownData = v;
    });
    if (!interaction.inGuild())
      return interaction.reply("Must be in server to do that!");
    if (typeof interaction.member.permissions === "string")
      return interaction.reply({
        ephemeral: true,
        content: "Something went wrong!",
      });
    if (
      context.perms.length &&
      !interaction.member.permissions.has(context.perms)
    )
      return interaction.reply({
        ephemeral: true,
        content: `Sorry, but you're not allowed to do that! You need these permissions: ${context.perms
          .map((e) => `\`${e}\``)
          .join("\n")}`,
      });
    const runFunct = (): void => {
      context
        .execute(interaction)
        .then(() => {
          const cooldowns = this.bot.cooldowns.get(context.name);
          const cdd = {
            until: new Date(Date.now() + context.cooldown),
            user: interaction.user.id,
          } as Cooldown;
          if (!cooldowns) {
            this.bot.cooldowns.set(context.name, [cdd]);
          } else {
            this.bot.cooldowns.set(context.name, [...cooldowns, cdd]);
          }
        })
        .catch((err) => {
          interaction
            .reply({
              ephemeral: true,
              content: `Whoops! Something went wrong when doing that!`,
            })
            .catch((err) => {
              this.bot.logger.error(err);
              interaction.channel?.send(
                `Whoops! Something went wrong when doing that!`
              );
            });
          this.bot.logger.error(
            `CTX Menu ${contextName} failed!\nError: ${err}`
          );
        });
    };
    runFunct();
  };
}
