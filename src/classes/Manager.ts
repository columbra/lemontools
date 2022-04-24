import Bot from "./Bot";

export default class Manager {
  // Date.now()
  protected readonly _create: number;
  protected bot: Bot;
  protected readonly _name: string;
  protected constructor(name: string, bot: Bot) {
    this._create = Date.now();
    this._name = name;
    this.bot = bot;

    this.bot.logger.info(
      `${this._name} successfully started. Took ${Date.now() - this._create}ms`
    );
  }
}
