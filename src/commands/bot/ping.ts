/**
 * @fileoverview Ping command
 * @since v3.0.0
 */

import Command from "../../classes/commands/Command";
import Reply from "../../classes/commands/CommandCustomReply";
import LemonToolsEmbed from "../../classes/embeds/LemonToolsEmbed";

export default new Command(
  {
    name: "ping",
    description: "Get the WebSocket ping",
    category: "bot",
    options: [],
  },
  async ({ lemontools, ctx }) => {
    const { ping } = lemontools.ws;
    ctx.reply(
      new Reply(
        new LemonToolsEmbed(
          {
            description: `:ping_pong: Pong! \`${ping}ms\``,
          },
          ctx.interaction.user
        )
      )
    );
  }
);
