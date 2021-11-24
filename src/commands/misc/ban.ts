import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { BotPermissions } from "../../interfaces/BotPermissions";
import { Command } from "../../interfaces/Command";
import { User } from "../../schema/User";

export = class BanUser extends Command {
  name = "banuser";
  disabled? = false;
  description = "Ban a user from the bot";
  usage = "<user>";
  aliases = ["sudoban", "b"];
  args = true;
  example = "Windows95#6969";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addUserOption((opt) =>
      opt.setName("user").setDescription("User to ban").setRequired(true)
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
        permissions: BotPermissions.BANNED,
        note: "BANNED WITHOUT MERCY!",
      });
      await newUser.save();
      ctx.reply({ embeds: [this.simpleEmbed("BANNED! F")] });
    } else {
      const perms = user.permissions | BotPermissions.BANNED;
      await User.findOneAndUpdate({ id: query.id }, { permissions: perms });
      ctx.reply({ embeds: [this.simpleEmbed("BANNED! F")] });
    }
  };
};
