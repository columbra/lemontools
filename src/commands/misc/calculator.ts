import { Message, MessageActionRow, MessageButton } from "discord.js";
import Command from "../../classes/Command";
import { simpleEmbed } from "../../util/embed";
import { evaluate } from "mathjs";
import { disabledComponents as disableComponents } from "../../util/components";

export default new Command({
  name: "calc",
  category: "misc",
  description: "Bring up an interactive calculator",
  perms: [],
  async execute({ bot, ctx }) {
    let msg: Message<boolean>;
    let query = " ";
    try {
      msg = (await ctx.reply({
        content: "```" + query + "```",
        components: getComponents(),
        fetchReply: true,
      })) as Message;
    } catch {
      return ctx.channel.send({
        embeds: [
          simpleEmbed(
            "Calculator failed to load. This is likely due to something deleting a message; try again.",
            bot
          ),
        ],
      });
    }
    const collector = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === ctx.user.id,
      time: (1 << 16) * 10, // 655350
      componentType: "BUTTON",
    });
    collector.on("collect", (i) => {
      collector.resetTimer();
      const val = i.customId;
      let content = "```" + query + "```";
      switch (val) {
        case "clear":
          query = " ";
          content = "```" + query + "```";
          break;
        case "=":
          try {
            const result = evaluate(query);
            content = `**Result:** \`${result}\``;
            query = " ";
          } catch {
            content =
              "Error: Something went wrong whilst doing that calculation. Press clear and try again";
          }
          break;
        default:
          query += val;
          content = "```" + query + "```";
          break;
      }
      i.update({ content }).catch();
    });
    collector.on("end", async () => {
      try {
        const message = await msg.fetch();
        await message.edit({
          components: disableComponents(message.components),
        });
      } catch {
        return;
      }
    });
  },
});
function getComponents() {
  const row1 = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("clear")
      .setLabel("Clear")
      .setStyle("DANGER"),
    new MessageButton().setCustomId("(").setLabel("(").setStyle("PRIMARY"),
    new MessageButton().setCustomId(")").setLabel(")").setStyle("PRIMARY"),
    new MessageButton().setCustomId("^").setLabel("^").setStyle("PRIMARY"),
    // not exactly sure what log to take here. could be log/ln, log10 or log2. using log10 for now
    new MessageButton()
      .setCustomId("log10(")
      .setLabel("log10")
      .setStyle("PRIMARY")
  );
  const row2 = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("7").setLabel("7").setStyle("SECONDARY"),
    new MessageButton().setCustomId("8").setLabel("8").setStyle("SECONDARY"),
    new MessageButton().setCustomId("9").setLabel("9").setStyle("SECONDARY"),
    new MessageButton().setCustomId("/").setLabel("÷").setStyle("PRIMARY"),
    new MessageButton().setCustomId("tan(").setLabel("tan").setStyle("PRIMARY")
  );
  const row3 = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("4").setLabel("4").setStyle("SECONDARY"),
    new MessageButton().setCustomId("5").setLabel("5").setStyle("SECONDARY"),
    new MessageButton().setCustomId("6").setLabel("6").setStyle("SECONDARY"),
    new MessageButton().setCustomId("*").setLabel("×").setStyle("PRIMARY"),
    new MessageButton().setCustomId("cos(").setLabel("cos").setStyle("PRIMARY")
  );
  const row4 = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("1").setLabel("1").setStyle("SECONDARY"),
    new MessageButton().setCustomId("2").setLabel("2").setStyle("SECONDARY"),
    new MessageButton().setCustomId("3").setLabel("3").setStyle("SECONDARY"),
    new MessageButton().setCustomId("-").setLabel("-").setStyle("PRIMARY"),
    new MessageButton().setCustomId("sin(").setLabel("sin").setStyle("PRIMARY")
  );
  const row5 = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("0").setLabel("0").setStyle("SECONDARY"),
    new MessageButton().setCustomId(".").setLabel(".").setStyle("SECONDARY"),
    new MessageButton().setCustomId("=").setLabel("=").setStyle("SUCCESS"),
    new MessageButton().setCustomId("+").setLabel("+").setStyle("PRIMARY"),
    new MessageButton().setCustomId("sqrt(").setLabel("√").setStyle("PRIMARY")
  );
  return [row1, row2, row3, row4, row5];
}
