import { Emoji, Message, MessageActionRow, MessageButton } from "discord.js";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import config from "../../config";
import Emojis from "../../utils/constants/Emojis";
import InteractionUtils from "../../utils/interaction/InteractionUtils";
import NumberUtils from "../../utils/number/NumberUtils";

export default new Command(
  {
    name: "random",
    description: "Generate a random number between two numbers (inclusive)",
    category: "tools",
    options: [
      {
        name: "min",
        description: "The minimum number",
        required: true,
        type: "NUMBER",
      },
      {
        name: "max",
        description: "The maximum number",
        required: true,
        type: "NUMBER",
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const min = ctx.interaction.options.getNumber("min", true);
    const max = ctx.interaction.options.getNumber("max", true);
    const number = NumberUtils.random(min, max);
    const reply = await ctx.reply(
      new Reply({
        embeds: [
          new LemonToolsEmbed(
            {
              description: `**Number:** \`${number}\`\nMin: \`${min}\`\nMax: \`${max}\``,
            },
            ctx.interaction.user
          ),
        ],
        components: [
          new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId("reroll")
              .setStyle("PRIMARY")
              .setEmoji(Emojis.REFRESH)
              .setLabel(`Reroll`),
          ]),
        ],
      })
    );
    if (!(reply instanceof Message))
      return ctx.followUp(
        new Reply(
          InteractionUtils.standaloneStdError(
            "Something went wrong whilst fetching the message.",
            ErrorCodes.MESSAGE_FETCH_RETURNED_APIMESSAGE
          )
        )
      );
    const coll = reply.createMessageComponentCollector({
      componentType: "BUTTON",
      time: config.bot.collectors.longTimeout,
      filter: (i) => i.user.id === ctx.interaction.user.id,
    });

    coll.on("collect", (i) => {
      const number = NumberUtils.random(min, max);
      i.update({
        embeds: [
          new LemonToolsEmbed(
            {
              description: `**New Number:** \`${number}\`\nMin: \`${min}\`\nMax: \`${max}\``,
            },
            i.user
          ),
        ],
      });
    });

    coll.on("end", () => {
      reply.edit({
        components: InteractionUtils.disableComponents(reply.components),
      });
    });
  }
);
