import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../../interfaces/Command";

export = class UserInfo extends Command {
  name = "userinfo";
  disabled? = false;
  description = "Fetch information about a user";
  usage = "[user]";
  aliases = ["userinformation", "user"];
  args = true;
  example = "@Windows95";
  cooldown = 1_000;
  category = "server";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addUserOption((opt) =>
      opt
        .setName("user")
        .setDescription("User to look up (optional)")
        .setRequired(false)
    );
  sudo = false;
  perms = [];

  execute = async (ctx: CommandInteraction) => {
    const user = ctx.options.getUser("user") ?? ctx.user;
    const embed = this.embed(
      {
        title: `Information about ${user.tag}`,
        fields: [
          {
            name: "General Info",
            value: `**Username:** ${user.username}\n**Discriminator:** ${user.discriminator}`,
            inline: true,
          },
          {
            name: "Account Information",
            value: `**Account created:** <t:${Math.floor(
              user.createdTimestamp / 1000
            )}:R> (<t:${Math.floor(user.createdTimestamp / 1000)}:F>)${
              user.accentColor
                ? `\n**Accent Colour:** \`[](colornames.org/color/${user.accentColor?.toString(
                    16
                  )})\``
                : ""
            }\n**Bot:** ${user.bot ? "Yes" : "No"}`,
          },
        ],
        thumbnail: {
          url: user.avatarURL({ dynamic: true }) ?? undefined,
        },
      },
      ctx
    );
    ctx.reply({ embeds: [embed] });
  };
};
