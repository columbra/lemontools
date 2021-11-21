import { SlashCommandBuilder } from "@discordjs/builders";
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  PermissionResolvable,
  TextChannel,
} from "discord.js";
import { EmbedColours } from "../../interfaces/Colours";
import { Command } from "../../interfaces/Command";

export = class EmbedCreator extends Command {
  name = "embed";
  disabled? = false;
  description = "Create an embed";
  usage = "<channel>";
  aliases = ["announce", "embd"];
  args = true;
  example = "#announcements";
  cooldown = 1_000;
  category = "server";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addChannelOption((opt) =>
      opt
        .setName("channel")
        .setDescription(
          "Channel to send embed to (make sure I have the right perms to chat there!)"
        )
        .setRequired(true)
        .addChannelType(0)
    );
  sudo = false;
  perms: PermissionResolvable[] = ["MANAGE_MESSAGES"];

  execute = async (ctx: CommandInteraction) => {
    const filter = (msg: Message) => msg.author.id === ctx.user.id;
    const ifilter = (i: MessageComponentInteraction) =>
      i.user.id === ctx.user.id;
    const channel = ctx.options.getChannel("channel") as TextChannel;
    if (!ctx.guild) return ctx.reply("This command cannot be used inside DMs.");
    if (!ctx.guild.me?.permissionsIn(channel).has(2048n))
      return ctx.reply(
        this.eph(
          "I don't have permissions to send messages in that channel! Please give me the right permissions, and try again!"
        )
      );
    const embed = new MessageEmbed();
    ctx.reply({
      embeds: [
        this.embed(
          {
            title: "Create an embed",
            description:
              "Welcome to the interactive embed creator!\n\n```Would you like a title?```",
          },
          ctx
        ),
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("skipTitle")
            .setLabel("Skip Title")
            .setStyle("DANGER"),
          new MessageButton()
            .setCustomId("goTitle")
            .setLabel("Set Title")
            .setStyle("PRIMARY"),
        ]),
      ],
    });
    const skip = await ctx.channel?.awaitMessageComponent({
      filter: ifilter,
      time: 1 << 16,
    });
    let title: string | undefined;
    if (!skip)
      return ctx.followUp(
        "Whoops! You didn't select a button in time. It has expired!"
      );
    const disabled = this.disabledComponents(
      (await ctx.fetchReply()).components as MessageActionRow[]
    );
    if (skip?.customId === "goTitle") {
      await ctx.editReply({ components: [] });
      await ctx.editReply({
        embeds: [
          this.embed(
            {
              title: "Create an embed",
              description:
                "Welcome to the interactive embed creator!\n\n```Enter a title!```",
            },
            ctx
          ),
        ],
      });
      title = (
        await ctx.channel?.awaitMessages({
          filter,
          max: 1,
          time: 1 << 16,
        })
      )?.first()?.content;
      if (!title)
        return ctx.followUp(
          "Title not entered in time! Stopping interactive creator!"
        );
      if (title.length >= 256)
        return await ctx.editReply({
          embeds: [
            this.embed(
              {
                title: "Create an embed | AN ERROR OCCURED",
                description:
                  "Welcome to the interactive embed creator!\n\n```Error! Title must be fewer than 256 characters. Cancelled creation!```",
              },
              ctx
            ),
          ],
        });
      embed.setTitle(title);
    }

    await ctx.editReply({
      embeds: [
        this.embed(
          {
            title: "Create an embed",
            description:
              "Welcome to the interactive embed creator!\n\n```Please enter a some body text for your embed! Multiple lines supported.```",
          },
          ctx
        ),
      ],
      components: [],
    });
    const description = (
      await ctx.channel?.awaitMessages({
        filter,
        max: 1,
        time: 1 << 25,
      })
    )?.first()?.content;
    if (!description)
      return ctx.followUp(
        "You did not enter a description in time. Stopped embed creation"
      );
    embed.setDescription(description);
    //
    ctx.editReply({
      embeds: [
        this.embed(
          {
            title: "Create an embed",
            description:
              "Welcome to the interactive embed creator!\n\n```Would you like a footer?```",
          },
          ctx
        ),
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("skipTitle")
            .setLabel("Skip Footer")
            .setStyle("DANGER"),
          new MessageButton()
            .setCustomId("goTitle")
            .setLabel("Set Footer")
            .setStyle("PRIMARY"),
        ]),
      ],
    });
    //
    const skipFooter = await ctx.channel?.awaitMessageComponent({
      filter: ifilter,
      time: 1 << 16,
    });
    let footer: string | undefined;
    if (!skipFooter)
      return ctx.followUp(
        "Whoops! You didn't select a button in time. It has expired!"
      );
    const disableFooter = this.disabledComponents(
      (await ctx.fetchReply()).components as MessageActionRow[]
    );
    if (skipFooter?.customId === "goTitle") {
      await ctx.editReply({ components: [] });
      await ctx.editReply({
        embeds: [
          this.embed(
            {
              title: "Create an embed",
              description:
                "Welcome to the interactive embed creator!\n\n```Enter a footer```",
            },
            ctx
          ),
        ],
      });
      footer = (
        await ctx.channel?.awaitMessages({
          filter,
          max: 1,
          time: 1 << 16,
        })
      )?.first()?.content;
      if (!footer)
        return ctx.followUp(
          "Footer not entered in time! Stopping interactive creator!"
        );
      if (footer.length >= 256)
        return await ctx.editReply({
          embeds: [
            this.embed(
              {
                title: "Create an embed | AN ERROR OCCURED",
                description:
                  "Welcome to the interactive embed creator!\n\n```Error! Footer must be fewer than 256 characters. Cancelled creation!```",
              },
              ctx
            ),
          ],
        });
      embed.setFooter(footer);
    }
    ctx.editReply({
      embeds: [
        this.embed(
          {
            title: "Create an embed",
            description:
              "Welcome to the interactive embed creator!\n\n```Would you like to have a timestamp?```",
          },
          ctx
        ),
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton()
            .setCustomId("noTimestamp")
            .setLabel("No Timestamp")
            .setStyle("DANGER"),
          new MessageButton()
            .setCustomId("timeStamp")
            .setLabel("Set Timestamp")
            .setStyle("PRIMARY"),
        ]),
      ],
    });
    const timestamp = await ctx.channel?.awaitMessageComponent({
      filter: ifilter,
      time: 1 << 16,
    });
    if (timestamp?.customId === "timeStamp") {
      embed.setTimestamp();
    }
    embed.setColor(EmbedColours.EMBED_COLOUR);
    // *** \\

    const followUp = await ctx.followUp({
      embeds: [embed],
      content: `Preview of your embed. This will be sent to ${channel}`,
      components: [
        new MessageActionRow().setComponents([
          new MessageButton()
            .setCustomId("confirm")
            .setLabel("Send")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle("DANGER"),
        ]),
      ],
    });
    const comp = await ctx.channel?.awaitMessageComponent({
      filter: ifilter,
      time: 1 << 25,
    });
    if (!comp) return ctx.followUp("Cancelled embed sending!");
    if (comp.customId === "cancel")
      return comp.followUp("Cancelled embed sending!");
    channel
      .send({ embeds: [embed] })
      .then(async () => {
        await ctx.editReply({
          embeds: [
            this.simpleEmbed(`Successfully sent embed to channel ${channel}.`),
          ],
          components: [],
        });
        if (!(followUp instanceof Message)) return;
        await followUp.edit({
          embeds: [
            this.simpleEmbed(`Successfully sent embed to channel ${channel}.`),
          ],
          components: [],
          content: null,
        });
      })
      .catch((err) => {
        ctx.followUp(`An error occured! ${err}`);
      });
  };
};
