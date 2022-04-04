import {
  ApplicationCommandDataResolvable,
  Collection,
  CommandInteraction,
  CommandInteractionOptionResolver,
  Permissions,
} from "discord.js";
import { EventEmitter } from "events";
import { promisify } from "util";
import Command from "../../classes/Command";
import Bot from "../../classes/NewBot";
import syncGlob from "glob";
import path from "path";
import getConfig from "../../helper/config/GetConfig";
import { epherrf } from "../../helper/util/embed";

const glob = promisify(syncGlob);

type Events =
  | "commandReceived"
  | "commandError"
  | "commandsRegistered"
  | "commandWipe"
  | "commandLoaded";

declare interface CommandManager {
  on(event: Events, listener: Function);
  emit(event: Events, ...args: unknown[]);
}

class CommandManager extends EventEmitter {
  private _create = Date.now();
  private readonly _commands: Collection<string, Command>;

  constructor(private bot: Bot) {
    super({});
    bot.logger.info(
      `CommandManager successfully started. Took ${Date.now() - this._create}ms`
    );
    this.loadCommands();
  }

  private async loadCommands() {
    const _start = Date.now();
    this.bot.logger.info("CommandManager: Loading commands");
    const rawCommands: ApplicationCommandDataResolvable[] = [];
    const commandFiles: string[] = await glob(
      path.join(__dirname, "../../commands/**/*.{ts,js}")
    );
    if (!commandFiles.length)
      return this.bot.logger.error("CommandManager: No commands found.");
    for (const file of commandFiles) {
      const command: Command = (await import(file)).default;
      this._commands.set(command.name, command);
      rawCommands.push(command);
      this.emit("commandLoaded", command);
    }

    this.registerCommands(
      rawCommands,
      this.bot.isDev() ? process.env.TEST_GUILD : null
    );
    this.bot.logger.info(
      `CommandManager: Command setting successful. Took ${
        Date.now() - _start
      }ms`
    );
  }

  private registerCommands(
    rawCommands: ApplicationCommandDataResolvable[],
    guildId?: string
  ) {
    this.bot.on("ready", async () => {
      this.bot.logger.info("CommandManager: Registering commands");

      if (guildId) {
        const guild = await this.bot.guilds.fetch(guildId);
        guild.commands.set(rawCommands);
        this.emit("commandsRegistered");
        return;
      }

      this.bot.application.commands.set(rawCommands);
      this.emit("commandsRegistered");
    });
  }

  private borderControl(command: Command, ctx: CommandInteraction) {
    /**
     * Glory to Arstotska
     *
     * I salute you, inspector!
     */

    const config = getConfig();
    if (!ctx.inGuild()) return false;
    if (
      !(ctx.member.permissions as unknown as Readonly<Permissions>).has(
        command.perms ?? []
      )
    )
      return false;
    if (command.sudo && !config.sudos.includes(ctx.user.id)) return false;

    return true;
  }

  public run(ctx: CommandInteraction) {
    this.emit("commandReceived", ctx.commandName);
    const command = this.commands.get(ctx.commandName);
    if (!command) return;
    if (!this.borderControl(command, ctx))
      return ctx.reply(
        epherrf(`
    You cannot execute that command here. Perhaps you are missing a permission.
    
    **Note:** Commands don't work in DMs
    `)
      );
    command
      .execute({
        args: ctx.options as CommandInteractionOptionResolver,
        bot: this.bot,
        ctx,
      })
      .catch((err) => {
        this.emit("commandError", err);
        this.bot.logger.error(err);
      });
  }

  public get commands(): Collection<string, Command> {
    return this._commands;
  }
  public set commands(value: Collection<string, Command>) {
    this.bot.logger.error(
      "CommandManager: Cannot override commands, it is read only."
    );
    return;
  }
}

export default CommandManager;
