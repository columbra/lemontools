import Command from "../../classes/Command";
import ms, { StringValue } from "../../lib/ms";
import Reminder from "../../schema/Reminder";
import { simpleEmbed } from "../../util/embed";
import { epherr, makeUUID } from "../../util/strings";

export default new Command({
  name: "remindme",
  description:
    "Set a customisable reminder to be send to your DMs at a specific time",
  category: "misc",
  perms: [],
  options: [
    {
      name: "reminder",
      description: "Reminder to send to your DMs",
      type: "STRING",
      required: true,
    },
    {
      name: "time",
      description: "How long to wait until I DM you",
      type: "STRING",
      required: true,
    },
  ],

  async execute({ bot, args, ctx }) {
    const timeStr = args.getString("time");
    const reminderStr = args.getString("reminder");
    const time = await ms(timeStr as StringValue).catch(() => null);
    if ((await Reminder.find({ userId: ctx.user.id })).length > 10)
      return ctx.reply(
        epherr`Sorry, but you can only have a max. of 10 reminders at any one time!`
      );
    if (!time)
      return ctx.reply(
        epherr`The time you entered was invalid. Please try again.`
      );
    await ctx.deferReply({ ephemeral: true });
    const reminder = new Reminder({
      time: time + Date.now(),
      reminder: reminderStr,
      userId: ctx.user.id,
      created: Date.now(),
      uuid: await makeUUID(ctx.user.id)
    });
    reminder
      .save()
      .then(() =>
        ctx.editReply({
          embeds: [
            simpleEmbed(
              `Successfully saved a reminder for **${reminderStr}** for <t:${Math.round(
                (time + Date.now()) / 1000
              )}:F>. \n\n***Please ensure your DMs are open or you will not recieve this. Reminders are checked every minute, so if you set something shorter, it may not arrive on time***`,
              bot
            ),
          ],
        })
      )
      .catch((err) =>{
        bot.logger.error(`Saving error for reminder! ${err}`)
        ctx.editReply(
          epherr`There was an error saving your reminder. Please try again at a later time...`
        )}
      );
  },
});
