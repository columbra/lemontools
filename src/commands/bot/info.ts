import Command from "../../classes/Command";
import { embed, inviteRow } from "../../helper/util/embed";
import { LemonEmojis } from "../../helper/util/emoji";
import discord from "discord.js";

export default new Command({
  name: "info",
  description: "Get some information about Lemon Tools",
  perms: [],
  category: "bot",
  async execute({ bot, ctx, args }) {
    ctx.reply({
      embeds: [
        embed(
          {
            title: `Information about ${bot.config.bot.name}`,
            description: bot.config.bot.description,
            fields: [
              {
                name: "General Info",
                value: `Owner: ${bot.config.bot.author}`,
              },
              {
                name: "Version Information",
                value: `${LemonEmojis.Node} Node Version: \`${process.version}\`
                :hammer_and_wrench: Architecture: \`${process.arch}\`
                ${LemonEmojis.v8} v8 Engine Version: \`${process.versions.v8}\`
                ${LemonEmojis.DiscordJS} DiscordJS Version: \`${discord.version}\``,
              },
              {
                name: "Stats for nerds",
                value: `${LemonEmojis.Var} Heap Usage: \`${
                  process.memoryUsage().heapUsed / 1_000_000
                }\`mb
                ${LemonEmojis.Property} Heap Total \`${
                  process.memoryUsage().heapTotal / 1_000_000
                }\`mb
                ${LemonEmojis.Class} C++ V8 Object Usage: \`${
                  process.memoryUsage().external / 1_000_000
                }\`mb
                ${LemonEmojis.Method} Total Allocation: \`${
                  process.memoryUsage().rss / 1_000_000
                }\`mb
                :id: PID: \`${process.pid}\`
                ${LemonEmojis.Tux} Platform: \`${process.platform}\``,
              },
            ],
          },

          ctx,
          bot
        ),
      ],
      components: [inviteRow],
    });
  },
});
