import { InteractionReplyOptions, MessageEmbed } from "discord.js";

export function capitalise(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}
export function epherr(strings: TemplateStringsArray): InteractionReplyOptions {
  return {
    embeds: [
      new MessageEmbed({
        description: strings.raw[0],
        color: "RED",
      }),
    ],
    ephemeral: true,
  };
}
