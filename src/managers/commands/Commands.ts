/**
 * @fileoverview Command loader and manager
 * @since v3.0.0
 */

import type Command from "../../classes/commands/Command";
import Manager from "../../classes/manager/Manager";
import type LemonTools from "../../LemonTools";
import FileSystemUtils from "../../utils/files/FileSystemUtils";
import paths from "path";

export default class Commands extends Manager {
  public commands = new Map<string, Command>();

  constructor(lemontools: LemonTools) {
    super(lemontools, "Commands");
    this.load();
  }

  async load(path: string = `${paths.join(__dirname, "../../commands")}/**/*`) {
    const commands = await FileSystemUtils.importGlob<Command>(path);
    await Promise.all(
      commands.map(async (command) =>
        this.commands.set(command.opts.name, command)
      )
    );
    this.lemontools.Logger.log(
      "info",
      "Commands",
      `Loaded ${this.commands.size} commands`
    );
  }
}
