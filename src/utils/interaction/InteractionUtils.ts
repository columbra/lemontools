/**
 * @fileoverview Utilities for managing interactions
 * @since v3.0.0
 */

import type {
  ButtonInteraction,
  CommandInteraction,
  SelectMenuInteraction,
} from "discord.js";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { v4 as uuidv4 } from "uuid";
import { MessageActionRow, MessageButton } from "discord.js";
import config from "../../config";
import ErrorCode, { ErrorCodes } from "../../classes/errors/ErrorCode";

export default class InteractionUtils {
  static async followUpConfirmation(
    interaction: CommandInteraction,
    content: string
  ) {
    const uuid = uuidv4();
    await interaction.followUp({
      embeds: [
        new LemonToolsEmbed({
          title: content,
        }),
      ],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              customId: `${uuid}_confirm`,
              style: "SUCCESS",
              label: "Confirm",
            }),
            new MessageButton({
              customId: `${uuid}_cancel`,
              style: "DANGER",
              label: "Cancel",
            }),
          ],
        }),
      ],
    });

    if (!interaction.channel) throw new Error("No channel found");

    const confirm = await interaction.channel.awaitMessageComponent({
      componentType: "BUTTON",
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000,
    });
    if (!confirm?.customId) return false;
    if (confirm.customId === `${uuid}_confirm`) return true;
    return false;
  }

  static standaloneStdError(content: string, code: ErrorCodes) {
    return {
      embeds: [
        new LemonToolsEmbed({
          color: config.style.colours.danger,
          title: `Sorry! Something went wrong on our end`,
          description: content,
          fields: [
            {
              name: `Error Code`,
              value: new ErrorCode(code).toString(),
            },
          ],
        }),
      ],

      components: [
        new MessageActionRow().setComponents([
          new MessageButton()
            .setURL(config.style.links.supportDiscord)
            .setEmoji("🙋")
            .setLabel(`Support Server`)
            .setStyle("LINK"),
        ]),
      ],
    };
  }

  static async standardError(
    interaction: RepliableInteractions,
    content: string,
    code: ErrorCodes
  ) {
    interaction.reply({
      embeds: [
        new LemonToolsEmbed(
          {
            color: config.style.colours.danger,
            title: `Sorry! Something went wrong on our end`,
            description: content,
            fields: [
              {
                name: `Error Code`,
                value: new ErrorCode(code).toString(),
              },
            ],
          },
          interaction.user
        ),
      ],

      components: [
        new MessageActionRow().setComponents([
          new MessageButton()
            .setURL(config.style.links.supportDiscord)
            .setEmoji("🙋")
            .setLabel(`Support Server`)
            .setStyle("LINK"),
        ]),
      ],
    });
  }

  static standaloneUserError(
    interaction: RepliableInteractions,
    content: string
  ) {
    return {
      embeds: [
        new LemonToolsEmbed(
          {
            color: config.style.colours.danger,
            description: content,
          },
          interaction.user
        ),
      ],
    };
  }

  static async userError(interaction: RepliableInteractions, content: string) {
    interaction.reply({
      embeds: [
        new LemonToolsEmbed(
          {
            color: config.style.colours.danger,
            description: content,
          },
          interaction.user
        ),
      ],
    });
  }

  static disableComponents(components: MessageActionRow[]) {
    for (const component of components) {
      for (const item of component.components) {
        item.setDisabled(true);
      }
    }
    return components;
  }
}

export type RepliableInteractions =
  | CommandInteraction
  | ButtonInteraction
  | SelectMenuInteraction;
