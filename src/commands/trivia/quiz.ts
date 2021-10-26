import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from "discord.js";
import { Command } from "../../interfaces/Command";
import { Result } from "../../interfaces/OpenTriviaApi";
import he, { decode } from "he";

export = class Quiz extends Command {
  name = "quiz";
  disabled? = false;
  description = "Generate a random trivia quiz!";
  usage = "";
  aliases = ["questionquiz", "trivia"];
  args = false;
  example = "";
  cooldown = 7_000;
  category = "trivia";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const body = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    const { data } = body as unknown as any;
    if (data.response_code === 4)
      return ctx.reply({
        embeds: [
          this.simpleEmbed(
            "Sorry, but the bot is out of new questions! Perhaps wait a few minutes for more questions to come!"
          ),
        ],
        ephemeral: true,
      });
    const result: Result = data.results[0];
    const embed = this.embed(
      {
        author: {
          name: "Questions provided by the OpenTrivia Database",
          url: "https://opentdb.com",
        },
        title: decode(result.question),
        description: `Difficulty: **${result.difficulty}.**\n\nYou have **1 minute** to answer!`,
      },
      ctx
    );

    const buttons = new MessageActionRow().addComponents(
      this.shuffle([result.correct_answer, ...result.incorrect_answers]).map(
        (e, i) => {
          return new MessageButton()
            .setCustomId(`quiz_button_${i}`)
            .setLabel(e)
            .setStyle("SECONDARY");
        }
      )
    );
    ctx.reply({
      embeds: [embed],
      components: [buttons],
    });
    const comp = await ctx.channel?.awaitMessageComponent({
      filter: (i) => i.user.id === ctx.user.id,
      time: 60_000,
      componentType: "BUTTON",
    });
    if (!comp) {
      ctx.followUp(
        `⏳ Whoops! Looks like you ran out of time! The correct answer is **${result.correct_answer}**`
      );
      const newButtons = this.disabledComponents([buttons]);
      return ctx.editReply({ components: newButtons });
    }
    const component = comp.component as MessageButton;
    if (component.label !== result.correct_answer)
      return comp.reply(
        `❌ You chose **${component.label}**. The correct answer was ${result.correct_answer}`
      );
    else return comp.reply("🎉 Correct!");
  };
};
