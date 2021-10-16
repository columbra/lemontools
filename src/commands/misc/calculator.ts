import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Command } from "../../interfaces/Command";
import { bitNot, evaluate } from "mathjs";

export = class Calc extends Command {
  name = "calc";
  disabled? = false;
  description = "Bring up an interactive calculator";
  usage = "";
  aliases = ["calculator", "calculate"];
  args = false;
  example = "";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;

  execute = async (interaction: CommandInteraction) => {
    let msg: Message;
    try {
      msg = (await interaction.deferReply({
        fetchReply: true,
      })) as Message;
    } catch (err) {
      return interaction.channel?.send("Message was deleted.");
    }
    let query = " ";
    await interaction.editReply({
      content: "```" + query + "```",
      components: this.components(),
    }); // WHY: Not bothered to escape all backticks
    const coll = msg.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 60, // 1 minute
      componentType: "BUTTON",
    });
    coll.on("collect", (button) => {
      coll.resetTimer()
      let val: string;
      try {
        val = button.customId;
      } catch {
        return;
      }
      let content: string = "";
      switch (val) {
        case "clear":
          query = " ";
          content = `\`\`\`${query}\`\`\``;
          break;
        case "=":
          try {
            const res = evaluate(query);
            content = `**Result:** ${res}`;
            query = " ";
          } catch (e) {
            content =
              "Whoops, something went wrong with calculating it... make sure the maths expression is valid!";
            query = " ";
          }
          break;
        default:
          query += val;
          content = `\`\`\`${query}\`\`\``;
          break;
      }
      button.update({ content }).catch();
    });
    coll.on("end", async () => {
      let message;
      try {
        message = await msg.fetch();
      } catch {
        return;
      }
      msg
        .edit({
          components: this.disabledComponents(message.components),
        })
        .catch();
    });
  };
  private components() {
    const row1 = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("clear").setLabel("C").setStyle("DANGER"),
      new MessageButton().setCustomId("(").setLabel("(").setStyle("PRIMARY"),
      new MessageButton().setCustomId(")").setLabel(")").setStyle("PRIMARY"),
      new MessageButton().setCustomId("^").setLabel("^").setStyle("PRIMARY"),
      // not exactly sure what log to take here. could be log/ln, log10 or log2
      new MessageButton()
        .setCustomId("log10(")
        .setLabel("log")
        .setStyle("PRIMARY")
    );
    const row2 = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("7").setLabel("7").setStyle("SECONDARY"),
      new MessageButton().setCustomId("8").setLabel("8").setStyle("SECONDARY"),
      new MessageButton().setCustomId("9").setLabel("9").setStyle("SECONDARY"),
      new MessageButton().setCustomId("/").setLabel("÷").setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("tan(")
        .setLabel("tan")
        .setStyle("PRIMARY")
    );
    const row3 = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("4").setLabel("4").setStyle("SECONDARY"),
      new MessageButton().setCustomId("5").setLabel("5").setStyle("SECONDARY"),
      new MessageButton().setCustomId("6").setLabel("6").setStyle("SECONDARY"),
      new MessageButton().setCustomId("*").setLabel("×").setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("cos(")
        .setLabel("cos")
        .setStyle("PRIMARY")
    );
    const row4 = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("1").setLabel("1").setStyle("SECONDARY"),
      new MessageButton().setCustomId("2").setLabel("2").setStyle("SECONDARY"),
      new MessageButton().setCustomId("3").setLabel("3").setStyle("SECONDARY"),
      new MessageButton().setCustomId("-").setLabel("-").setStyle("PRIMARY"),
      new MessageButton()
        .setCustomId("sin(")
        .setLabel("sin")
        .setStyle("PRIMARY")
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
};
