import { MessageEmbed } from "discord.js";
import Manager from "../../classes/Manager";
import type Bot from "../../classes/NewBot";
import getConfig from "../../helper/config/GetConfig";
import Reminder, { ReminderType } from "../../schema/reminder/Reminder";

export default class ReminderManager extends Manager {
  constructor(bot: Bot) {
    super("ReminderManager", bot);

    this.start();
  }

  async start() {
    const config = getConfig().modules.ReminderManager;
    const _start = Date.now();
    if (config.doInitalSweep)
      this.sendMessages(await this.findExpired()).then(() =>
        this.bot.logger.info(
          `ReminderManager: Finished initial sweep in ${Date.now() - _start}ms.`
        )
      );
    this.bot.logger.info(
      `ReminderManager: Starting reminder loop, repeating every ${config.checkInterval}ms`
    );
    setInterval(async () => {
      this.sendMessages(await this.findExpired());
    }, config.checkInterval);
  }

  findExpired(): Promise<ReminderType[]> {
    return Reminder.find({ time: { $lt: Date.now() } }).exec();
  }

  sendMessages(reminders: ReminderType[]) {
    return Promise.all(
      reminders.map(async (reminder) => {
        const deleteReminder = () =>
          Reminder.deleteOne({ uuid: reminder.uuid }).exec();
        const user = await this.bot.users.fetch(reminder.userId);
        user
          .send({
            embeds: [
              new MessageEmbed({
                title: "Reminder",
                description: reminder.reminder,
              }),
            ],
          })
          .then(deleteReminder, deleteReminder)
          .catch(() =>
            this.bot.logger.debug(
              `ReminderManager: Failed to send reminder to user ${user}.`
            )
          );
      })
    );
  }
}
