import Command from "../../classes/Command";
import { embed, errorMessage } from "../../util/embed";
import { epherr } from "../../util/strings";

export default new Command({
  name: "giveaways",
  category: "giveaways",
  description: "Commands to manage giveaways",
  perms: ["MANAGE_MESSAGES"],
  options: [
    {
      name: "reroll",
      type: "SUB_COMMAND",
      description: "Reroll a giveaway",
      options: [
        {
          name: "prize",
          description: "Giveaway to search for",
          type: "STRING",
          autocomplete: true,
          required: true,
        },
      ],
    },
    {
      name: "end",
      type: "SUB_COMMAND",
      description: "End a giveaway (immeditely chooses a winner)",
      options: [
        {
          name: "prize",
          description: "Giveaway to search for",
          type: "STRING",
          autocomplete: true,
          required: true,
        },
      ],
    },
    {
      name: "cancel",
      type: "SUB_COMMAND",
      description:
        "Cancel a giveaway (immeditely stops the giveaway and DOES NOT choose a winner)",
      options: [
        {
          name: "prize",
          description: "Giveaway to search for",
          type: "STRING",
          autocomplete: true,
          required: true,
        },
      ],
    },
  ],

  async execute({ bot, ctx, args }) {
    const subcmd = args.getSubcommand(true); // true here asserts that there must be a subcommand (for typechecking reasons)
    const prize: string | null = args.getString("prize", false);
    if (!prize) return ctx.reply(epherr`Giveaway not found!`);
    const giveaway = bot.GiveawayManager.giveaways.find(
      (g) => g.messageId === prize && g.guildId === ctx.guildId
    );
    if (!giveaway) return ctx.reply(epherr`Giveaway not found!`);
    switch (subcmd) {
      case "reroll":
        if (!giveaway.ended)
          return ctx.reply(
            epherr`You cannot roll an active giveaway, only ended giveaways may be rerolled.`
          );
        giveaway
          .reroll()
          .then(() => {
            ctx.reply({
              embeds: [
                embed(
                  {
                    title: `Giveaway successfully rerolled.`,
                    description: `[:arrow_upper_right: **Click to see giveaway**](${giveaway.messageURL})`,
                  },
                  ctx,
                  bot
                ),
              ],
            });
          })
          .catch(() => {
            ctx.reply(
              epherr`Whoops! There was an error trying to reroll that giveaway.`
            );
          });
        break;
      case "end":
        if (giveaway.ended)
          return ctx.reply(
            epherr`That giveaway has already ended! You can't double-end a giveaway!`
          );
        giveaway
          .end()
          .then(() => {
            ctx.reply({
              embeds: [
                embed(
                  {
                    title: `Giveaway successfully ended.`,
                    description: `[:arrow_upper_right: **Click to see giveaway (ended)**](${giveaway.messageURL})`,
                  },
                  ctx,
                  bot
                ),
              ],
            });
          })
          .catch(() => {
            ctx.reply(
              epherr`Whoops! There was an error trying to end that giveaway.`
            );
          });
        break;
        
      case "cancel":
         if (giveaway.ended)
           return ctx.reply(
             epherr`That giveaway has already ended! You can't stop a giveaway which has already ended!`
           );
         giveaway
           .pause({
             content: ":x: This giveaway has been cancelled :x:",
             unPauseAfter: Infinity
           }  as any /* Fix for incorrect typings in stable version */)
           .then(() => {
             ctx.reply({
               embeds: [
                 embed(
                   {
                     title: `Giveaway successfully cancelled.`,
                     description: `[:arrow_upper_right: **Click to see giveaway (cancelled)**](${giveaway.messageURL})`,
                   },
                   ctx,
                   bot
                 ),
               ],
             });
           })
           .catch(() => {
             ctx.reply(
               epherr`Whoops! There was an error trying to cancel that giveaway.`
             );
           });
        break;
      default:
        return ctx.reply(epherr`Something went wrong. Try again later.`);
    }
  },
});
