/**
 * @fileoverview Utilities for managing interactions
 * @since v3.0.0
 */

import type { CommandInteraction } from "discord.js";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import { v4 as uuidv4 } from "uuid";
import { MessageActionRow, MessageButton } from "discord.js";

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

    if(!interaction.channel) throw new Error("No channel found")

    const confirm = await interaction.channel.awaitMessageComponent({
      componentType: "BUTTON",
      filter: (i) => i.user.id === interaction.user.id,
      time: 60_000,
    });
    if (!confirm?.customId) return false;
    if (confirm.customId === `${uuid}_confirm`) return true;
    return false;
  }
}
