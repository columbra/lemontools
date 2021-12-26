import { MessageActionRow } from "discord.js";

export function disabledComponents(
  components: MessageActionRow[]
): MessageActionRow[] {
  return components.map((row) => {
    return new MessageActionRow().addComponents(
      row.components.map((component) => component.setDisabled(true))
    );
  });
}