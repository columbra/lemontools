/**
 * @fileoverview Calc v2
 * @since v3.0.0
 */

import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import { evaluate, norm } from "mathjs";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import config from "../../config";
import Colours from "../../utils/constants/Colours";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

export default new Command(
  {
    name: "calc",
    description: "Bring up an interactive calculator",
    category: "tools",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    let Ans = 0;
    let expression = "";
    let shift: 1 | 0 = 0;

    const message = await ctx.reply(
      new Reply({
        content: "``` ```",
        embeds: [
          new MessageEmbed({
            description: `\`\`\` \`\`\``,
            color: Colours.DISCORD_EMBED_COLOR,
          }),
        ],
        components: normalButtons,
      })
    );
    if (!(message instanceof Message))
      return ctx.followUp(
        new Reply(
          InteractionUtils.standaloneStdError(
            `Something went wrong!`,
            ErrorCodes.MESSAGE_FETCH_RETURNED_APIMESSAGE
          )
        )
      );
    const coll = message.createMessageComponentCollector({
      componentType: "BUTTON",
      filter: (i) => i.user.id === ctx.interaction.user.id,
      time: config.bot.collectors.longTimeout,
    });

    coll.on("collect", (i) => {
      const { customId } = i;
      let error = false;
      let solution = false;
      if (customId === "del") expression = expression.slice(0, -1);
      else if (customId === "ac") expression = " ";
      else if (customId === "=") {
        solution = true;
        try {
          // Copy expression to prevent it from being modified
          Ans = evaluate(expression.slice(), {
            Ans,
          });
        } catch {
          error = true;
        }
      } else if (customId === "off") {
        coll.stop();
        i.update({
          components: [
            ...InteractionUtils.disableComponents(
              buttons[shift]
            ),
          ],
        });
        return;
      } else if (customId === "shift") {
        shift = shift === 0 ? 1 : 0;
      } else expression += customId;
      coll.resetTimer();

      i.update({
        content: `\`\`\`${expression + " "}\`\`\``,
        embeds: [
          new MessageEmbed({
            description: `\`\`\`${
              solution && !error
                ? Ans
                : error
                ? `Math Error: Please check your expression!`
                : " "
            }\`\`\``,
            color: Colours.DISCORD_EMBED_COLOR,
          }),
        ],
        components: buttons[shift],
      });
    });

    coll.on("end", () => {
      message.edit({
        components: InteractionUtils.disableComponents(buttons[shift]),
      });
    });
  }
);

const normalButtons = [
  new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId(`shift`)
      .setStyle("SECONDARY")
      .setLabel("S"),
    new MessageButton().setCustomId("(").setStyle("PRIMARY").setLabel("("),
    new MessageButton().setCustomId(")").setStyle("PRIMARY").setLabel(")"),

    new MessageButton().setCustomId("del").setStyle("DANGER").setLabel("DEL"),
    new MessageButton().setCustomId("ac").setStyle("DANGER").setLabel("AC"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("7").setStyle("SECONDARY").setLabel("7"),
    new MessageButton().setCustomId("8").setStyle("SECONDARY").setLabel("8"),
    new MessageButton().setCustomId("9").setStyle("SECONDARY").setLabel("9"),

    new MessageButton().setCustomId("*").setStyle("PRIMARY").setLabel("*"),
    new MessageButton().setCustomId("/").setStyle("PRIMARY").setLabel("/"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("4").setStyle("SECONDARY").setLabel("4"),
    new MessageButton().setCustomId("5").setStyle("SECONDARY").setLabel("5"),
    new MessageButton().setCustomId("6").setStyle("SECONDARY").setLabel("6"),

    new MessageButton().setCustomId("+").setStyle("PRIMARY").setLabel("+"),
    new MessageButton().setCustomId("-").setStyle("PRIMARY").setLabel("-"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("1").setStyle("SECONDARY").setLabel("1"),
    new MessageButton().setCustomId("2").setStyle("SECONDARY").setLabel("2"),
    new MessageButton().setCustomId("3").setStyle("SECONDARY").setLabel("3"),

    new MessageButton()
      .setCustomId("sqrt(")
      .setStyle("PRIMARY")
      .setLabel("sqrt"),
    new MessageButton().setCustomId("^").setStyle("PRIMARY").setLabel("^"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("0").setStyle("SECONDARY").setLabel("0"),
    new MessageButton().setCustomId(".").setStyle("SECONDARY").setLabel("."),
    new MessageButton()
      .setCustomId("*10^")
      .setStyle("SECONDARY")
      .setLabel("x10^"),

    new MessageButton().setCustomId("Ans").setStyle("PRIMARY").setLabel("Ans"),

    new MessageButton().setCustomId("=").setStyle("SUCCESS").setLabel("="),
  ]),
];

const shiftButtons = [
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId(`shift`).setStyle("SUCCESS").setLabel("S"),
    new MessageButton().setCustomId("[").setStyle("SECONDARY").setLabel("["),
    new MessageButton().setCustomId("]").setStyle("SECONDARY").setLabel("]"),

    new MessageButton().setCustomId("del").setStyle("DANGER").setLabel("DEL"),
    new MessageButton().setCustomId("ac").setStyle("DANGER").setLabel("AC"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("pi").setStyle("PRIMARY").setLabel("pi"),
    new MessageButton().setCustomId("e").setStyle("PRIMARY").setLabel("e"),
    new MessageButton().setCustomId("tau").setStyle("PRIMARY").setLabel("tau"),

    new MessageButton().setCustomId("phi").setStyle("PRIMARY").setLabel("phi"),
    new MessageButton().setCustomId("i").setStyle("PRIMARY").setLabel("i"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("%").setStyle("SECONDARY").setLabel("%"),
    new MessageButton()
      .setCustomId(" mod ")
      .setStyle("SECONDARY")
      .setLabel("mod"),
    new MessageButton().setCustomId("!").setStyle("SECONDARY").setLabel("!"),

    new MessageButton().setCustomId(">").setStyle("SECONDARY").setLabel(">"),
    new MessageButton().setCustomId("<").setStyle("SECONDARY").setLabel("<"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId("&").setStyle("SECONDARY").setLabel("&"),
    new MessageButton().setCustomId("~").setStyle("SECONDARY").setLabel("~"),
    new MessageButton().setCustomId("^|").setStyle("SECONDARY").setLabel("^|"),

    new MessageButton().setCustomId("|").setStyle("SECONDARY").setLabel("|"),
    new MessageButton().setCustomId("<<").setStyle("SECONDARY").setLabel("<<"),
  ]),
  new MessageActionRow().addComponents([
    new MessageButton().setCustomId(">>").setStyle("SECONDARY").setLabel(">>"),
    new MessageButton()
      .setCustomId(">>>")
      .setStyle("SECONDARY")
      .setLabel(">>>"),
    new MessageButton().setCustomId("<=").setStyle("SECONDARY").setLabel("<="),

    new MessageButton().setCustomId(">=").setStyle("SECONDARY").setLabel(">="),

    new MessageButton().setCustomId("=").setStyle("SUCCESS").setLabel("="),
  ]),
];

const buttons: readonly [MessageActionRow[], MessageActionRow[]] = [
  normalButtons,
  shiftButtons,
] as const;
