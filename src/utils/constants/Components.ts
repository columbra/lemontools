import { MessageActionRow, MessageButton } from "discord.js";
import config from "../../config";
import Emojis from "./Emojis";

export const PromoRow = new MessageActionRow().addComponents(
  [
    new MessageButton()
      .setLabel("Invite")
      .setEmoji(Emojis.ADD)
      .setURL(config.style.links.inviteLink),
    new MessageButton()
      .setLabel("Support Server")
      .setEmoji(Emojis.HELP)
      .setURL(config.style.links.supportDiscord),
    new MessageButton()
      .setLabel("Website")
      .setEmoji(Emojis.GLOBE)
      .setURL(config.style.links.website),
  ].map((b) => b.setStyle("LINK"))
);
