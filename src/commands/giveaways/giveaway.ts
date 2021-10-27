import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, PermissionResolvable } from "discord.js";
import ms from "ms";
import { Command } from "../../interfaces/Command";

export = class GiveawayCommand extends Command {
  name = "giveaway";
  disabled? = false;
  description = "Start a giveaway";
  usage = "<channel>";
  aliases = ["giveawaystart", "give"];
  args = true;
  example = "#giveaways";
  cooldown = 1_000;
  category = "giveaways";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description)
    .addChannelOption((opt) =>
      opt
        .setName("channel")
        .setDescription("Channel to send giveaway to")
        .setRequired(true)
    );
  sudo = false;
  perms: PermissionResolvable[] = ["MANAGE_MESSAGES"];

  execute = async (interaction: CommandInteraction) => {
    if (typeof interaction.member?.permissions === "string")
      return interaction.reply(
        "Error! No permissions. You need the MANAGE_MESSAGES permissions to begin giveaways!"
      );
    if (!interaction.member?.permissions.has("MANAGE_MESSAGES"))
      return interaction.reply(
        "Error! No permissions. You need the MANAGE_MESSAGES permissions to begin giveaways!"
      );
    const { channel } = interaction;
    const gChannel = interaction.options.getChannel("channel");

    if (!gChannel)
      return interaction.reply(
        "Error! You did not specify a channel! Please try again!"
      );
    if (gChannel.type !== "GUILD_TEXT")
      return interaction.reply("Oi! Pick a text channel, not a voice/category");
    const filter = (m: Message) => m.author.id === interaction.user.id;
    interaction.reply(
      ":tada: Welcome to the interaction giveaway creator. **Start by typing what you would like to give away**"
    );
    const name = (
      await channel?.awaitMessages({
        max: 1,
        filter,
      })
    )?.first()?.content;
    if (!name)
      return channel?.send(
        "Item to giveaway must not be empty! Giveaway creation cancelled!"
      );
    channel?.send(
      `Success! Item to give away is ${name} **Now type the amount of winners you want**`
    );
    const winners = +(
      (
        await channel?.awaitMessages({
          max: 1,
          filter,
        })
      )?.first()?.content ?? 1
    );
    if (isNaN(winners))
      return channel?.send(
        "Winners must be a valid number! Giveaway creation cancelled."
      );

    channel?.send(`Success! There will be ${winners} winners.`);
    channel?.send(
      "Please type the duration you would like the giveaway to last. Use `m` for minutes, `h` for hours and `d` for days."
    );
    const rawTime = (await channel!?.awaitMessages({ max: 1, filter })).first()
      ?.content;
    if (!rawTime)
      return channel?.send(
        "Hey! You need to type in a valid time. Stopped giveaway creation"
      );
    const properTime = ms(rawTime);
    if (!properTime)
      return channel?.send(
        "Hey! You need to enter in a valid time. Gicwaway creation cancelled"
      );
    channel?.send(`Success! The giveaway wil last ${ms(properTime)}`);
    channel?.send("Giveaway creation successful!");
    this.bot.giveawayManager.start(gChannel as any, {
      // didn't want to do this, ts is annoying
      duration: properTime,
      prize: name,
      winnerCount: winners,
      hostedBy: interaction.user,
    });
  };
};
