/**
 * @fileoverview Hash a string using popular algorithms
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import crypto from "node:crypto";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";
import InteractionUtils from "../../utils/interaction/InteractionUtils";

const choices: { name: string; value: string }[] = [
  {
    name: "MD5",
    value: "md5",
  },
];

export default new Command(
  {
    name: "hash",
    description: "Hash a string",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to hash",
        type: "STRING",
        required: true,
      },
      {
        name: "algorithm",
        description: "Algorithm to use",
        type: "STRING",
        required: true,
        choices,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    const algorithm = ctx.interaction.options.getString("algorithm", true);

    if (text.length > 1000)
      return InteractionUtils.userError(
        ctx.interaction,
        `Due to performance and Discord limit reasons, the text cannot be longer than 1000 characters`
      );

    await ctx.interaction.deferReply();

    const hash = crypto.createHash(algorithm);
    hash.update(text);
    const digest = hash.digest("hex");

    ctx.edit(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `Original Text: \`${text}\`\nHashed: \`${digest}\`\nAlgorithm: \`${algorithm}\``,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
