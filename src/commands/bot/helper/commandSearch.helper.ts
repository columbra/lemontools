import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import Reply from "../../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../../utils/interaction/InteractionUtils";
import StringUtils from "../../../utils/string/StringUtils";
import crypto from "node:crypto";
import Emojis from "../../../utils/constants/Emojis";
import type CommandCustomContext from "../../../classes/commands/CommandCustomContext";
import type LemonTools from "../../../LemonTools";

export async function commandSearch(
  ctx: CommandCustomContext,
  session: string,
  lemontools: LemonTools,
  i: SelectMenuInteraction
) {
  const newSession = crypto.randomUUID();
  const categories = new Set(
    Array.from(lemontools.Commands.commands.values()).map(
      (c) => c.opts.category
    )
  );
  const embed = new LemonToolsEmbed(
    {
      title: "Search Commands",
      description:
        "Use the filters below to narrow down your search. Already got a specific command in mind? Use `/help command` with the command name to see specific information about that command.",
    },
    ctx.interaction.user
  );
  const filters: [string[]] = [[]];
  await i.update(
    new Reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId(`${newSession}_s_category`)
            .setOptions(
              Array.from(categories).map((c) => ({
                label: StringUtils.capitialise(c),
                value: `${session}_${c.toLowerCase()}`,
              }))
            )
            .setMinValues(1)
            .setPlaceholder("Filter by category")
        ),
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId(`${newSession}_submit`)
            .setLabel("Search")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId(`${newSession}_cancel`)
            .setLabel("Cancel")
            .setStyle("DANGER"),
        ]),
      ],
    })
  );
  const coll = (ctx.state.reply as Message).createMessageComponentCollector({
    componentType: "SELECT_MENU",
    filter: (i) =>
      i.customId.includes(`${newSession}_s`) &&
      i.user.id === ctx.interaction.user.id,
    time: 69420, // ms
  });
  coll.on("collect", async (i) => {
    coll.resetTimer();
    const type = i.customId.slice(39);
    const values = i.values.map((v) => v.slice(37));
    if (type === "category") filters[0] = [...values];

    i.deferUpdate();
  });

  const submit = await (ctx.state.reply as Message).awaitMessageComponent({
    componentType: "BUTTON",
    time: 600000,
    filter: (i) => i.user.id === ctx.interaction.user.id,
  });
  if (!submit)
    return ctx.interaction.editReply({
      components: [
        ...InteractionUtils.disableComponents(
          (await (ctx.state.reply as Message).fetch(true)).components
        ),
      ],
    });
  if (submit.customId.includes("_submit")) {
    // Conversion from iterable to array needed for filter
    const filtered = Array.from(lemontools.Commands.commands.values()).filter(
      (c) => filters[0].includes(c.opts.category)
    );

    const reply = filtered
      .map((c) => `**${c.opts.name}**\n${Emojis.REPLY} ${c.opts.description}`)
      .join("\n");
    if (reply.length > 3000)
      return ctx.edit(
        new Reply(
          InteractionUtils.standaloneUserError(
            ctx.interaction,
            `Your search is too broad. Please narrow down your search to avoid hitting Discord's message length limit!`
          )
        )
      );
    ctx.edit(
      new Reply({
        embeds: [
          new LemonToolsEmbed(
            {
              title: "Search Results",
              description: `Found ${filtered.length} command(s).\n\n${reply}\n\nHint: Want to know more about a specific command? Use \`/help command\` with the command name to see specific information about that command.`,
            },
            ctx.interaction.user
          ),
        ],
        components: [
          ...InteractionUtils.disableComponents(
            (await (ctx.state.reply as Message).fetch(true)).components
          ),
        ],
      })
    );

    return;
  }
  if (submit.customId.includes("_cancel")) {
    return submit.update(
      new Reply(
        new LemonToolsEmbed(
          {
            description: "Search cancelled",
          },
          ctx.interaction.user
        )
      )
    );
  }
}
