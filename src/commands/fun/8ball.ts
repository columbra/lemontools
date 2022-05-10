import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

const responses = [
  "As I see it, yes.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "It is certain.",
  "It is decidedly so.",
  "Most likely.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Outlook good.",
  "Reply hazy, try again.",
  "Signs point to yes.",
  "Very doubtful.",
  "Without a doubt.",
  "Yes.",
  "Yes - definitely.",
  "You may rely on it.",
];

export default new Command(
  {
    name: "8ball",
    description: "Ask the magical 8 Ball a question",
    category: "fun",
    options: [
      {
        name: "question",
        description: "Question to ask the 8 Ball",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const question = ctx.interaction.options.getString("question", true);
    const response = responses[Math.floor(Math.random() * responses.length)];
    ctx.reply(
      new Reply(
        new LemonToolsEmbed({
          title: `You have invoked the powers of the magical 8 Ball `,
          description: `You asked: **${question}**\nThe :8ball: 8 Ball has answered: **${response}**`,
        })
      )
    );
  }
);
