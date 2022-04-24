import Manager from "../../classes/Manager";
import Bot from "../../classes/Bot";
import syncGlob from "glob";
import { promisify } from "util";
import path from "path";
import {
  ApplicationCommandOptionChoice,
  AutocompleteInteraction,
  Collection,
} from "discord.js";
import AutoCompleter from "../../classes/AutoCompleter";

const glob = promisify(syncGlob);

export default class AutoCompleterManager extends Manager {
  public readonly autoCompleters = new Collection<string, AutoCompleter>();

  constructor(bot: Bot) {
    super("AutoCompleterManager", bot);
    this.loadAutoCompleters();
  }

  private async loadAutoCompleters() {
    const _start = Date.now();
    let errors = 0;
    this.bot.logger.info("AutoCompleterManager: Loading auto completers");
    const files = await glob(
      path.join(__dirname, "../../autocomplete/**/*.{ts,js}")
    );

    // Async Loading
    await Promise.all(
      files.map(async (file, i) => {
        const autoCompleter: AutoCompleter = (await import(file)).default;
        if (!autoCompleter.command) {
          errors++;
          return this.bot.logger.error(
            `AutoCompleterManager: AutoCompleter #${i} has no command. Not loaded`
          );
        }
        this.autoCompleters.set(autoCompleter.command, autoCompleter);
      })
    );

    this.bot.logger.info(
      `AutoCompleterManager: Loaded ${
        this.autoCompleters.size
      } auto completers. Took ${
        Date.now() - _start
      }ms. ${errors} errors recorded.`
    );
  }

  public run(
    ctx: AutocompleteInteraction
  ): void | ApplicationCommandOptionChoice[] {
    const { commandName: command } = ctx;
    this.bot.logger.verbose(`AutoCompleterManager: Running autcomplete for ${command}`);
    const autoCompleter = this.autoCompleters.get(command);
    if (!autoCompleter) {
      this.bot.logger.error(
        `AutoCompleterManager: No auto completer found for command ${command}`
      );
      return;
    }
    return autoCompleter.execute({
      bot: this.bot,
      ctx,
    });
  }
}
