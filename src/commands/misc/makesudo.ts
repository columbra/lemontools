import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { BotPermissions } from "../../interfaces/BotPermissions";
import { Command } from "../../interfaces/Command";
import { User } from "../../schema/User";

export = class MakeSudo extends Command {
  name = "makesudo";
  disabled? = false;
  description = "Make a person have sudo permissions";
  usage = "<user>";
  aliases = ["addgroup", "makeroot"];
  args = true;
  example = "Windows95#6969";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User to give sudo").setRequired(true)
    );
  sudo = true;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const query = ctx.options.getUser("user");

    if (!query) return ctx.reply(this.eph("You must provide a user"));
    const user = await User.findOne({ id: query.id });
    if (!user) {
      const newUser = new User({
        id: query.id,
        permissions: BotPermissions.SUDO,
        note: "New user added through /makesudo;",
      });
      await newUser.save();
      ctx.reply({ embeds: [this.simpleEmbed("Added new sudo!")] });
    } else {
      const perms = user.permissions | BotPermissions.SUDO;
      await User.findOneAndUpdate(
        { id: query.id },
        { permissions: perms },
        { new: true }
      );

      ctx.reply({ embeds: [this.simpleEmbed("Added new sudo!")] });
    }
  };
};
