import { ClientEvents, CommandInteraction } from "discord.js";
import { BotPermissions } from "../interfaces/BotPermissions";
import { Cooldown } from "../interfaces/Cooldown";
import { Event } from "../interfaces/Event";
import { User } from "../schema/User";

export default class InteractionCreate extends Event {
  event = "interactionCreate" as keyof ClientEvents;
  execute = async (Ainteraction: CommandInteraction[]) => {
    const [interaction] = Ainteraction;
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const perms = +(
      (await User.findOne({ id: interaction.user.id })).permissions ?? 0b10
    );
    if (perms & 0b1)
      return interaction.reply(`You are banned from using this bot!`);
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
    if (!interaction.inGuild())
      return interaction.reply("Must be in server to execute commands!");
    if (typeof interaction.member.permissions === "string")
      return interaction.reply({
        ephemeral: true,
        content: "Something went wrong!",
      });
    if (
      command.perms.length &&
      !interaction.member.permissions.has(command.perms)
    )
      return interaction.reply({
        ephemeral: true,
        content: `Sorry, but you're not allowed to do that! You need these permissions: ${command.perms
          .map((e) => `\`${e}\``)
          .join("\n")}`,
      });
    if (
      command.sudo &&
      !(perms & BotPermissions.OWNER || perms & BotPermissions.SUDO)
    ) {
      // Big bitwise logic
      return interaction.reply({
        ephemeral: true,
        content: `Sorry, but you're not allowed to do that! You need these permissions: \`${BotPermissions.OWNER}\` OR \`${BotPermissions.SUDO}\`. (Bot Owner or Sudo). You only have these permissions: ${perms}`,
      });
    }
    const runFunct = (): void => {
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
          interaction
            .reply({
              ephemeral: true,
              content: `Whoops! Something went wrong when executing that command.`,
            })
            .catch((err) => {
              this.bot.logger.error(err);
              interaction.channel?.send(
                `Whoops! Something went wrong when executing that command.`
              );
            });
          this.bot.logger.error(
            `Command ${commandName} failed!\nError: ${err}`
          );
        });
    };
    if (cooldownData) {
      if (Date.now() >= cooldownData.until.getTime()) return runFunct();
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
    runFunct();
  };
}
