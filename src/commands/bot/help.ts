import {
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import Command from "../../classes/Command";
import { disabledComponents } from "../../util/components";
import { embed, errorMessage, inviteRow } from "../../util/embed";
import { capitalise } from "../../util/strings";

export default new Command({
  name: "help",
  description: "List all my commands or get information on a specific command",
  category: "bot",
  perms: [],
  example: "info",
  usage: "[command]",
  options: [
    {
      name: "command",
      description: "Command to get specific information about",
      type: "STRING",
      autocomplete: true,
    },
  ],

  async execute({ bot, ctx, args }) {
    const query = args.getString("command");
    if (!query) {
      const msg = (await ctx.deferReply({ fetchReply: true })) as Message;

      const { commands } = bot;
      const categories = new Set<string>();
      const res = embed(
        {
          title: `Command Categories for ${bot.config.bot.name}`,
        },
        ctx,
        bot
      );
      const choices = new MessageSelectMenu().setCustomId("help_select");

      for (const command of commands.values()) {
        categories.add(command.category);
      }
      for (const category of categories) {
        choices.addOptions([
          {
            label: capitalise(category),
            value: category,
            description: `The ${capitalise(category)} category`,
          },
        ]);
      }
      res.setDescription(
        Array.from(categories)
          .map((c) => `\`${capitalise(c)}\``)
          .join(" ")
      );
      ctx.editReply({
        embeds: [res],
        components: [
          new MessageActionRow().addComponents([choices]),
          inviteRow,
        ],
      });
      const comp = msg.createMessageComponentCollector({
        componentType: "SELECT_MENU",
        filter: (i) => i.user.id === ctx.user.id,
        time: 30000,
      });
      let selected = false;
      comp.on("end", () => {
        if (selected) return;
        ctx.editReply({
          components: disabledComponents([
            new MessageActionRow().addComponents([choices]),
          ]),
        });
      });
      comp.on("collect", (i) => {
        const [selection] = i.values;
        selected = true;
        ctx.editReply({
          components: [inviteRow],
          embeds: [
            embed(
              {
                title: `Commands for category \`${capitalise(selection)}\``,
                description: `${commands
                  .filter((v) => v.category === selection)
                  .map((c) => `\`${c.name}\` - ${c.description}\n`)
                  .join(" ")}\n***Hint:*** *You can type /command [command] to view more information about it*`,
              },
              ctx,
              bot
            ),
          ],
        });
        i.reply({
          fetchReply: true,
          content: "Loading category data...",
        }).then((m) => (m as Message).delete());
      });
    } else {
      const command = bot.commands.get(query.replace("/", ""));
      if (!command)
        return ctx.reply(
          errorMessage(
            "The command you have entered does not exist. Please check your spelling and try again."
          )
        );
      const fields: EmbedFieldData[] = [];

      fields.push({
        name: `Usage`,
        value: `\`/${command.name} ${command.usage ?? ""}\``,
      });
      fields.push({
        name: `Category`,
        value: command.category,
      });

      fields.push({
        name: "Example",
        value: `\`/${command.name} ${command.example ?? ""}\``,
      });

      if (command.options?.length) {
        let value = "";
        command.options.forEach((opt, i) => {
          value += `${i + 1}. ${opt.name} - \`${opt.type
            .toString()
            .toUpperCase()}\`\n`;
        });
        fields.push({
          value,
          name: `Options`,
        });
      }
      ctx.reply({
        embeds: [
          embed(
            {
              fields,
              title: `\`/${command.name}\``,
              description: command.description,
            },
            ctx,
            bot
          ),
        ],
        components: [inviteRow],
      });
    }
  },
});
