import { InteractionReplyOptions, MessageEmbed } from "discord.js";
import { rnd, secureRandomness } from "./number";
import { sleep } from "./promise";

export function capitalise(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}
export function epherr(strings: TemplateStringsArray, ...any); // Overload to satisfy TypeScript
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
export async function makeUUID(userId: string): Promise<string> {
  const first = Date.now();
  await sleep(rnd(1, 5_000)); // Insecure randomness is OK here
  const second = Date.now();
  const random = await secureRandomness();
  return `${first}-${second}-${userId}-${random}`;
}

export function testUUID(uuid: string) {
  const regex = /\d+-\d+-\d{18}-\d+/;
  return regex.test(uuid);
}
