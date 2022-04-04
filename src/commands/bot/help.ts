import {
  ApplicationCommandNumericOption,
  ApplicationCommandOption,
  EmbedFieldData,
  Message,
  MessageActionRow,
  MessageSelectMenu,
} from "discord.js";
import Command from "../../classes/Command";
import { disabledComponents as disableComponents } from "../../helper/util/components";
import { embed, errorMessage, inviteRow } from "../../helper/util/embed";
import { capitalise } from "../../helper/util/strings";

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
      autocomplete: false,
    },
  ],

  async execute({ bot, ctx, args }) {
    const query = args.getString("command");
    if (!query) {
      const msg = (await ctx.deferReply({ fetchReply: true })) as Message;

      const { commands } = bot.CommandManager;
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
        `${commands.size} commands\n` +
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
      comp.on("end", () => {
        ctx.editReply({
          components: disableComponents([
            new MessageActionRow().addComponents([choices]),
          ]).concat([inviteRow]),
        });
      });
      comp.on("collect", (i) => {
        const [selection] = i.values;
        comp.resetTimer();
        i.update({
          components: [
            new MessageActionRow().addComponents([choices]),
            inviteRow,
          ],
          embeds: [
            embed(
              {
                title: `Commands for category \`${capitalise(selection)}\``,
                description: `${commands
                  .filter((v) => v.category === selection)
                  .map((c) => `\`${c.name}\` - ${c.description}\n`)
                  .join(
                    " "
                  )}\n***Hint:*** *You can type /help [command] to view more information about it*`,
              },
              ctx,
              bot
            ),
          ],
        });
      });
    } else {
      const command = bot.CommandManager.commands.get(query.replace("/", ""));
      if (!command)
        return ctx.reply(
          errorMessage(
            "The command you have entered does not exist. Please check your spelling and try again."
          )
        );
      const fields: EmbedFieldData[] = [];
      let usage = "";
      if (command.options.length) {
        command.options.forEach((opt) => {
          const sym = (
            opt as ApplicationCommandNumericOption
          ) /* To stop TS from complaining iT doES nOt ExiSt oN sUBcoMMand gRoup */
            .required
            ? "<>"
            : "[]";
          usage += ` ${sym[0]}${opt.name}${sym[1]}`;
        });
      }

      fields.push({
        name: `Usage`,
        value: `\`/${command.name}${usage}\``,
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
