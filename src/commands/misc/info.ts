import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import { Command } from "../../interfaces/Command";
import { inviteRow } from "../../static/inviteRow";
import * as config from "../../../config.json";
import Emojis from "../../interfaces/Emoji";
import os from "node-os-utils";

const { cpu, os: sys } = os;

export = class Info extends Command {
  name = "info";
  disabled? = false;
  description = "Get some information about the bot";
  usage = "";
  aliases = ["information", "inform"];
  args = false;
  example = "";
  cooldown = 1_000;
  category = "misc.";
  guildOnly = false;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  sudo = false;
  perms = [];

  execute = async (interaction: CommandInteraction) => {
    const embed = this.embed(
      {
        title: `Information about ${config.name}`,
        description: `**Created by:** ${
          config.author
        }\n**Language:** TypeScript\n**Production Ready:** ${
          config.production ? "Yes" : "No"
        }\n\n**About:**\n${
          config.name
        } is a multipurpose tools bot, which has a multitude of features not covered by other bots, such as QR Code creation, conversation starters and much, much more. Invite me to your servers today! Invite: **[Link](${this.bot.generateInvite(
          {
            scopes: ["bot", "applications.commands"],
            permissions: new Permissions(448928796608n),
          }
        )})**`,
        fields: [
          {
            name: "Stats for Nerds",
            value: `${Emojis.NODE} Node Version \`${
              process.version
            }\`\n<:lemoncpu:922643272550219808> CPU Cores \`${cpu.count()}\`\n:desktop: OS Type ${sys.type()}\nPlatform/Architecture \`${sys.platform()}/${sys.arch()}\``,
          },
        ],
      },
      interaction
    );
    interaction.reply({ embeds: [embed], components: [inviteRow] });
  };
};
