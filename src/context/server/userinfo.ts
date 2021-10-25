import { ContextMenuCommandBuilder } from "@discordjs/builders";
import { ContextMenuInteraction } from "discord.js";
import { ContextMenu } from "../../interfaces/ContextMenu";

export = class UserInfo extends ContextMenu {
  readonly cooldown = 1000;
  name = "User Information";
  type = 2;
  data = new ContextMenuCommandBuilder().setName(this.name).setType(this.type);
  perms = [];

  execute = async (ctx: ContextMenuInteraction) => {
    const user = ctx.options.getUser("user");
    if (!user) return ctx.reply({ ephemeral: true, content: "Error!" });
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
    ctx.reply({ ephemeral: true, embeds: [embed] });
  };
};
