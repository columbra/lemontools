import { CacheType, CommandInteraction } from "discord.js";
import Command from "../../classes/Command";
import UserBlockingPreferences from "../../schema/UserBlockingPreferences";
import { epherrf, simpleEmbed } from "../../util/embed";

export default new Command({
  name: "block",
  description: "Configure messages sent to you by the bot",
  category: "bot",
  perms: [],
  options: [
    {
      name: "welcomes",
      description: "Configure welcome messages",
      type: "SUB_COMMAND",
      options: [
        {
          name: "toggle",
          description: "Toggle welcome messages on or off",
          type: "BOOLEAN",
          required: true,
        },
      ],
    },
    {
      name: "unblock",
      description: "Unblock ALL messages sent to you by the bot",
      type: "SUB_COMMAND",
    },
    {
      name: "list",
      description: "List blocked messages",
      type: "SUB_COMMAND",
    },
  ],
  async execute({ bot, args, ctx }) {
    await ctx.deferReply({
      ephemeral: true,
    });
    const subcommand = args.getSubcommand(true);
    const doc = await UserBlockingPreferences.findOne({ userId: ctx.user.id })
      .lean()
      .exec();
    switch (subcommand) {
      case "unblock":
        if (!doc)
          return ctx.editReply(epherrf(`You have not blocked anything yet!`));
        await UserBlockingPreferences.deleteOne({ userId: ctx.user.id });
        ctx.editReply({
          embeds: [simpleEmbed(`You have unblocked all messages!`, bot)],
        });
        break;
      case "list":
        if (!doc)
          return ctx.editReply(epherrf(`You have not blocked anything yet!`));
        if (!doc.blocks.length)
          return ctx.editReply(epherrf(`You have not blocked anything yet!`));
        ctx.editReply({
          embeds: [
            simpleEmbed(
              `You have blocked the following messages:\n\n${doc.blocks.join(
                (b) => `•\`${b}\`\n`
              )}`,
              bot
            ),
          ],
        });
        break;
      default:
        const toggle = args.getBoolean("toggle", true);
        const toBlocks = [];
        const removeBlocks = [];
        toggle ? toBlocks.push(subcommand) : removeBlocks.push(subcommand);
        await editUserBlockingPrefs(ctx, toBlocks, removeBlocks);
        ctx.editReply({
          embeds: [
            simpleEmbed(
              `You have ${toggle ? "blocked" : "unblocked"} ${subcommand}`,
              bot
            ),
          ],
        });
    }
  },
});

// write a function to see if a document about the user exist in the database
// if the user is not in the database, create a new document
// if the user is in the database, edit the document
// make it async
async function editUserBlockingPrefs(
  ctx: CommandInteraction<CacheType>,
  toBlocks: string[],
  removeBlocks: string[]
) {
  const doc = await UserBlockingPreferences.findOne({ userId: ctx.user.id })
    .lean()
    .exec();
  if (!doc) {
    return await UserBlockingPreferences.create({
      userId: ctx.user.id,
      blocks: [...toBlocks], // Can't remove blocks if user does not have any to begin with!
    });
  }
  const newBlocks = [
    ...(doc.blocks || []),
    ...toBlocks.filter((b) => !(doc?.blocks || []).includes(b)),
  ].filter((x) => !removeBlocks.includes(x)); // True = keep element
  await UserBlockingPreferences.updateOne(
    { userId: ctx.user.id },
    { blocks: newBlocks }
  );
}
