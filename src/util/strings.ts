import { InteractionReplyOptions, MessageEmbed } from "discord.js";
import { rnd } from "./number";
import { sleep } from "./promise";

export function capitalise(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}
export function epherr(strings: TemplateStringsArray, ...any) // Overload to satisfy TypeScript
export function epherr(strings: TemplateStringsArray): InteractionReplyOptions {
  return {
    embeds: [
      new MessageEmbed({
        description: strings.raw.join(""),
        color: "RED",
      }),
    ],
    ephemeral: true,
  };
}

// Custom UUID maker, from two time stamps + userId + random number
export function makeUUID(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const first = Date.now();
    sleep(rnd(1, 2)).then(() => {
      const second = Date.now();
      const random = rnd(1, 10_000_000); // Ten million should be enough
      resolve(`${first}-${second}-${userId}-${random}`);
    });
  });
}

export function testUUID(uuid: string) {
  const regex = /\d+-\d+-\d{18}-\d+/;
  return regex.test(uuid)
}
