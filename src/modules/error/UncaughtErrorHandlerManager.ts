import Manager from "../../classes/Manager";
import Bot from "../../classes/NewBot";

export default class UncaughtErrorHandlerManager extends Manager {
  private _errors = 0;
  constructor(bot: Bot) {
    process.on("uncaughtException", (err) => {
      this._errors++;
      const now = new Date();
      bot.logger.crit(
        `UncaughtErrorHandlerManager: Uncaught Exception: ${err.message}`
      );
      bot.logger.verbose(
        `UncaughtErrorHandlerManager: Error Details for ${err.name} #${this._errors}`
      );
      bot.logger.verbose(`Occured: ${now.toLocaleString()} - ${now.getTime()}`);
      bot.logger.verbose(`Stack: ${err.stack}`);
      bot.logger.verbose(`Message: ${err.message}`);
    });
    
    process.on("unhandledRejection", (err) => {
      this._errors++;
      const now = new Date();
      bot.logger.crit(
        `UncaughtErrorHandlerManager: Uncaught Rejection. Check verbose log file.`
      );
      bot.logger.verbose(
        `UncaughtErrorHandlerManager: Error Details for uncaught rejection #${this._errors}`
      );
      bot.logger.verbose(`Occured: ${now.toLocaleString()} - ${now.getTime()}`);
      bot.logger.verbose(`Error: ${err}`);
    });

    super("UncaughtErrorHandlerManager", bot);
  }
}
