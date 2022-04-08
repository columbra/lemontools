import { promisify } from "util";
import Manager from "../../classes/Manager";
import Bot from "../../classes/NewBot";
import syncGlob from "glob";
import path from "path";
import LemonPlugin from "../../classes/LemonPlugin";

const glob = promisify(syncGlob);

export default class PluginManager extends Manager {
  constructor(bot: Bot) {
    super("PluginManager", bot);
    this.loadPlugins();
  }

  private async loadPlugins() {
    const _start = Date.now();
    this.bot.logger.info("PluginManager: Loading plugins");
    const pluginFiles: string[] = await glob(
      path.join(__dirname, "../../plugins/**/*.{ts,js}")
    );
    if (!pluginFiles.length)
      return this.bot.logger.error("PluginManager: No plugins found.");
    for (const file of pluginFiles) {
      const plugin: LemonPlugin = (await import(file)).default;
      try {
        this.bot.logger.verbose(
          `PluginManager: ${plugin.name} loaded and running`
        );
        plugin.func(this.bot);
      } catch (err) {
        this.bot.logger.error(
          `PluginManager: Error occured at plugin ${plugin.name}. Trace: ${err.stack}`
        );
      }
    }

    this.bot.logger.info(
      `PluginManager: Plugin loading successful. Took ${Date.now() - _start}ms`
    );
  }
}
