import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, PermissionResolvable } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class Ban extends Command {
  name = "ban";
  disabled? = false;
  description = "Ban a person by mention";
  usage = "<user>";
  args = true;
  example = "@BadPerson#1234";
  cooldown = 0;
  category = "moderation";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addUserOption((opt) =>
      opt.setName("member").setDescription("Member to ban").setRequired(true)
    );
  sudo = false;
  perms: PermissionResolvable[] = ["BAN_MEMBERS"];

  execute = async (ctx: CommandInteraction) => {
    const user = ctx.options.getUser("member");
    if (!user)
      return ctx.reply({
        embeds: [
          this.simpleEmbed("You didn't specify a member. Please try again."),
        ],
        ephemeral: true,
      });
    if (!ctx.memberPermissions?.has("BAN_MEMBERS"))
      return ctx.reply({
        embeds: [this.simpleEmbed("You don't have permission to do that!")],
        ephemeral: true,
      });
    if (!ctx.guild?.me?.permissions.has("BAN_MEMBERS"))
      return ctx.reply({
        embeds: [
          this.simpleEmbed(
            `I don't have permission to do that. Please give **${this.bot.config?.name}** permission to ban members`
          ),
        ],
        ephemeral: true,
      });
    ctx.guild.members
      .ban(user)
      .catch((err) =>
        ctx.reply({
          embeds: [
            this.simpleEmbed(
              "Something went wrong. We could not ban that member. Make sure my role is above the member you are attempting to ban, and try again"
            ),
          ],
          ephemeral: true,
        })
      )
      .then((r) =>
        ctx.reply({
          embeds: [this.simpleEmbed(`Successfully banned ${user}.`)],
        })
      );
  };
};
