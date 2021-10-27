import { ContextMenuCommandBuilder } from "@discordjs/builders";
import {
  ContextMenuInteraction,
  MessageActionRow,
  MessageButton,
  PermissionResolvable,
} from "discord.js";
import { ContextMenu } from "../../interfaces/ContextMenu";
import { ContextType } from "../../interfaces/ApplicationCommandType";

export = class StopGiveaway extends ContextMenu {
  readonly cooldown = 1000;
  name = "Stop Giveaway";
  type = ContextType.Message as number;
  data = new ContextMenuCommandBuilder().setName(this.name).setType(this.type);
  perms: PermissionResolvable[] = ["MANAGE_MESSAGES"];

  execute = async (ctx: ContextMenuInteraction) => {
    const query = ctx.options.getMessage("message")?.id;
    const err = this.errorEmbed("You must specify a valid ID!");
    if (!query) return ctx.reply({ embeds: [err], ephemeral: true });
    if (query.length !== 18)
      return ctx.reply({ embeds: [err], ephemeral: true });

    const giveaway = this.bot.giveawayManager.giveaways.find(
      (g) => g.guildId === ctx.guildId && g.messageId === query
    );
    if (!giveaway)
      return ctx.reply({
        ephemeral: true,
        content: `Giveaway not found! Make sure the message you selected is a valid giveaway!`,
      });
    const conf = this.embed(
      {
        title: "Please confirm this action!",
        description: `Please confirm that you would like to delete the giveaway for **${giveaway.prize}**!\n\nYou have **15** seconds to decide`,
      },
      ctx
    );
    const comp = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("confirm")
        .setEmoji("☑")
        .setLabel("Confirm Deletion")
        .setStyle("DANGER"),
      new MessageButton()
        .setCustomId("cancel")
        .setEmoji("❌")
        .setLabel("Cancel Deletion")
        .setStyle("PRIMARY"),
    ]);
    await ctx.reply({ components: [comp], embeds: [conf], ephemeral: true });
    const repl = await ctx.channel?.awaitMessageComponent({
      componentType: "BUTTON",
      filter: (i) => i.user.id === ctx.user.id,
      time: 15_000,
    });
    const disabled = this.disabledComponents([comp]);
    if (!repl) {
      ctx.editReply({ components: disabled });
      return ctx.followUp({ ephemeral: true, content: "Cancelled deletion!" });
    }
    if (repl.customId === "confirm") {
      this.bot.giveawayManager
        .delete(query)
        .then((g) =>
          repl.reply({
            content: `${ctx.user}, the giveaway for **${g.prize}** has been deleted!`,
            ephemeral: true,
          })
        )
        .catch((err) => {
          this.bot.logger.error(`Error whilst deleting giveaway! ${err}`);
          ctx.followUp({
            ephemeral: true,
            content:
              "Sorry! An error occured whilst trying to delete that! Please try again!",
          });
        });
      ctx.editReply({ components: disabled });
    } else {
      ctx.editReply({ components: disabled });
      return repl.reply({ content: "Cancelled deletion!", ephemeral: true });
    }
  };
};
