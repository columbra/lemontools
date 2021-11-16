import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class Snipe extends Command {
  name = "snipe";
  disabled? = false;
  description = "You just got sniped!";
  usage = "";
  aliases = ["undelete", "sniper"];
  args = true;
  example = "";
  cooldown = 1_000;
  category = "server";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addNumberOption((opt) =>
      opt.setName("snipenum").setDescription("Snipe to get")
    );

  sudo = false;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const snipes = this.bot.snipedMessages.get(ctx.channelId);
    const snipeNum = (ctx.options.getNumber("snipenum") ?? 1) - 1;

    if (!snipes) return ctx.reply(this.eph("No deleted messages!"));
    if (!snipes.length) return ctx.reply(this.eph("No deleted messages!"));
    if (snipeNum > 5) return ctx.reply(this.eph("Maximum snipe number is 5!"));

    const target = snipes[snipeNum];

    if (!target && snipeNum !== 0)
      return ctx.reply(
        this.eph(
          `No deleted messages! There are only ${snipes.length} messages avaliable to snipe.`
        )
      );
    if (!target) return ctx.reply(this.eph("No deleted messages!"));
    const embed = this.embed(
      {
        title: `Sniped Message`,
        fields: [
          { name: `Text`, value: target.content ?? "No text!", inline: true },
          { name: `Attatchments`, value: target.attachments.size.toString() },
        ],
        author: {
          iconURL:
            target.author.displayAvatarURL() ??
            "https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png",
          name: target.author.tag,
        },
        image: {
          url: target.attachments.first()?.proxyURL,
        },
        description: `Sniped message from ${target.author.tag}. Please do not use this tool for harrasment, or your server may be placed on a blacklist! \nSide Note: Sniped messages can only show the first image which was deleted.`,
      },
      ctx
    );
    ctx.reply({ embeds: [embed], content: `:gun: Pew pew! Sniped!!!` });
  };
};
