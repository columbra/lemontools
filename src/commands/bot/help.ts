/**
 * @fileoverview Help command
 * @since v3.0.0
 */

import { Message, MessageActionRow, MessageSelectMenu } from "discord.js";
import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../utils/interaction/InteractionUtils";
import StringUtils from "../../utils/string/StringUtils";
import crypto from "node:crypto";
import Emojis from "../../utils/constants/Emojis";
import { ErrorCodes } from "../../classes/errors/ErrorCode";
import { commandSearch } from "./helper/commandSearch.helper";
import { PromoRow } from "../../utils/constants/Components";

export default new Command(
  {
    name: "help",
    description: "Lookup command information",
    category: "bot",
    options: [
      {
        name: "command",
        description: "Command to lookup",
        type: "STRING",
        required: false,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const query = ctx.interaction.options.getString("command")?.toLowerCase?.();
    const { commands } = lemontools.Commands;
    if (query) {
      const command = commands.get(query);
      if (!command)
        return InteractionUtils.userError(
          ctx.interaction,
          "The command you have requested to look up does not exist. Check your spelling and try again."
        );
      const embed = new LemonToolsEmbed(
        {
          title: `\`/${command.opts.name}\``,
          description: command.opts.description,
          fields: [
            {
              name: `Usage`,
              value: `\`/${command.opts.name}${
                command.opts.options
                  ? ` ${command.opts.options
                      .map(
                        (o) =>
                          `${o.required ? "<" : "["}${o.name}${
                            o.required ? ">" : "]"
                          }`
                      )
                      .join(" ")}`
                  : ""
              }\``,
            },
            {
              name: `Category`,
              value: StringUtils.capitialise(command.opts.category),
            },
            {
              name: `Options`,
              value:
                command.opts.options
                  ?.map(
                    (o, i) =>
                      `**${i + 1}.** ${o.name} (${o.description}) - \`${
                        o.type
                      }\``
                  )
                  .join("\n") ?? "None",
            },
          ],
        },
        ctx.interaction.user
      );
      return ctx.reply(new Reply(embed));
    }
    // IF THE USER USES /help WITHOUT PARAMS
    // OPEN A HELP MENU

    // Generate unique session UUID
    // This makes sure only the original user can interaction with their own help menu
    const session = crypto.randomUUID();
    const embed = new LemonToolsEmbed(
      {
        title: "Help Menu",
        fields: [
          {
            name: "How to use this menu",
            value: `Click on the dropdown below to select an action. You can also click on any of the buttons below to select an action.`,
          },
        ],
      },
      ctx.interaction.user
    );

    // Generate the menu
    const actionChoices = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setPlaceholder("Select an action")
        .setCustomId(`${session}_actionselect`)
        .addOptions([
          {
            label: "Search Commands",
            value: `${session}_search`,
            description: "Search for a specific command",
            emoji: Emojis.SEARCH,
          },
          {
            label: "See Links",
            value: `${session}_links`,
            description: "See important links",
            emoji: Emojis.EXTERNAL,
          },
        ]),
    ]);

    // Send reply
    await ctx.reply(
      new Reply({
        embeds: [embed],
        components: [actionChoices],
      })
    );

    // // Add reply to the state
    // ctx.state.reply = reply;

    const selection = await ctx.interaction.channel
      ?.awaitMessageComponent({
        filter: (i) =>
          i.customId.includes(`${session}_`) &&
          i.user.id === ctx.interaction.user.id,
        componentType: "SELECT_MENU",
        time: 60000, // ms
      })
      .catch(() => null);

    // If selection expired, disabled components
    if (selection === null)
      return ctx.interaction.editReply({
        components: InteractionUtils.disableComponents([actionChoices]),
      });

    switch (selection?.values[0]) {
      case `${session}_search`:
        // Open command search dialogue
        commandSearch(ctx, session, lemontools, selection);
        break;

      case `${session}_links`:
        // Open links dialogue
        selection.update(
          new Reply({
            embeds: [
              new LemonToolsEmbed(
                {
                  description: `Click the buttons below to see select an action.`,
                },
                ctx.interaction.user
              ),
            ],
            components: [PromoRow],
          })
        );
    }
  }
);
