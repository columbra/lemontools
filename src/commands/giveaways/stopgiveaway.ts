import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  PermissionResolvable,
} from "discord.js";
import { Command } from "../../interfaces/Command";

export = class StopGiveaway extends Command {
  name = "stopgiveaway";
  disabled? = false;
  description = "Delete a giveaway";
  usage = "<message id>";
  aliases = ["delga", "stopgive"];
  args = true;
  example = "900901769897443380";
  cooldown = 1_000;
  category = "giveaways";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addStringOption((opt) =>
      opt
        .setDescription(
          "Message ID of giveaway to stop. Right click to copy ID!"
        )
        .setName("id")
        .setRequired(true)
    );

  sudo = false;
  perms: PermissionResolvable[] = ["MANAGE_MESSAGES"];

  execute = async (interaction: CommandInteraction) => {
    const query = interaction.options.getString("id");
    const err = this.errorEmbed("You must specify a valid ID!");
    if (!query) return interaction.reply({ embeds: [err], ephemeral: true });
    if (query.length !== 18)
      return interaction.reply({ embeds: [err], ephemeral: true });

    const giveaway = this.bot.giveawayManager.giveaways.find(
      (g) => g.guildId === interaction.guildId && g.messageId === query
    );
    if (!giveaway)
      return interaction.reply({
        ephemeral: true,
        content: `Giveaway not found! Make sure you have copy-pasted the correct message ID, and try again!`,
      });
    const conf = this.embed(
      {
        title: "Please confirm this action!",
        description: `Please confirm that you would like to delete the giveaway for **${giveaway.prize}**!\n\nYou have **15** seconds to decide`,
      },
      interaction
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
    await interaction.reply({ components: [comp], embeds: [conf] });
    const repl = await interaction.channel?.awaitMessageComponent({
      componentType: "BUTTON",
      filter: (i) => i.user.id === interaction.user.id,
      time: 15_000,
    });
    const disabled = this.disabledComponents([comp]);
    if (!repl) {
      interaction.editReply({ components: disabled });
      return interaction.channel?.send("Cancelled deletion!");
    }
    if (repl.customId === "confirm") {
      this.bot.giveawayManager
        .delete(query)
        .then((g) =>
          repl.reply(
            `${interaction.user}, the giveaway for **${g.prize}** has been deleted!`
          )
        )
        .catch((err) => {
          this.bot.logger.error(`Error whilst deleting giveaway! ${err}`);
          interaction.channel?.send(
            "Sorry! An error occured whilst trying to delete that! Please try again!"
          );
        });
      interaction.editReply({ components: disabled });
    } else {
      interaction.editReply({ components: disabled });
      return repl.reply("Cancelled deletion!");
    }
  };
};
