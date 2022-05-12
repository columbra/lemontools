/**
 * @fileoverview Generate QR Codes
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "qr",
    description: "Generate a QR code",
    category: "tools",
    options: [
      {
        name: "text",
        description: "Text to encode (Tip: can be a URL)",
        type: "STRING",
        required: true,
      },
    ],
  },
  async ({ lemontools, ctx }) => {
    const text = ctx.interaction.options.getString("text", true);
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            image: {
              url: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                text
              )}`,
            },
          },
          ctx.interaction.user
        )
      )
    );
  }
);
