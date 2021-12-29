import { MessageActionRow, MessageSelectMenu } from "discord.js";
import Command from "../../classes/Command";
import { disabledComponents } from "../../util/components";
import { embed } from "../../util/embed";
import { capitalise } from "../../util/strings";

export default new Command({
  name: "help",
  description: "List all my commands or get information on a specific command",
  category: "misc",
  perms: [],
  options: [
    {
      name: "command",
      description: "Command to get specific information about",
      type: "STRING",
    },
  ],

  async execute({ bot, ctx, args }) {
    await ctx.deferReply();

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
      components: [new MessageActionRow().addComponents([choices])],
    });
    const comp = ctx.channel.createMessageComponentCollector({
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
        components: [],
        embeds: [
          embed(
            {
              title: `Commands for category ${capitalise(selection)}`,
              description: commands
                .filter((v) => v.category === selection)
                .map((c) => `\`${c.name}\``)
                .join(" "),
            },
            ctx,
            bot
          ),
        ],
      });
    });
  },
});
