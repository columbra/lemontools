import { Message, MessageActionRow, MessageButton } from "discord.js";
import Command from "../../classes/Command";
import { simpleEmbed } from "../../util/embed";
import { rnd } from "../../util/number";
import { disabledComponents as disableComponents } from "../../util/components";

export default new Command({
  name: "random",
  description: "Generate a random number",
  category: "fun",
  perms: [],

  options: [
    {
      name: "min",
      description: "Minimum value",
      type: "NUMBER",
      required: true,
    },
    {
      name: "max",
      description: "Maximum value",
      type: "NUMBER",
      required: true,
    },
  ],
  example: "12 40",
  usage: "<min> <max>",

  async execute({ bot, ctx, args }) {
    const min = args.getNumber("min");
    const max = args.getNumber("max");

    const msg = (await ctx.reply({
      embeds: [simpleEmbed(`Your random number is ${rnd(min, max)}`, bot)],
      fetchReply: true,
    })) as Message;
    await msg.edit({
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("refresh")
            .setEmoji("🔄")
            .setLabel("Reroll")
            .setStyle("PRIMARY"),
        ]),
      ],
    });
    const coll = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === ctx.user.id,
      componentType: "BUTTON",
      time: 1 << 16,
    });
    coll.on("collect", (i) => {
      i.update({
        embeds: [
          simpleEmbed(`Your new random number is ${rnd(min, max)}`, bot),
        ],
      });
      coll.resetTimer();
    });
    coll.on("end", () => {
      msg.edit({
        components: disableComponents([
          new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId("refresh")
              .setEmoji("🔄")
              .setLabel("Reroll")
              .setStyle("PRIMARY"),
          ]),
        ]),
      });
    });
  },
});
