/**
 * @fileoverview Custom constructor for a MessageEmbed with utility stuff
 * @since v3.0.0
 */

import { MessageEmbed } from "discord.js";
import type { User, MessageEmbedOptions } from "discord.js";
import config from "../../config";

export default class LemonToolsEmbed extends MessageEmbed {
  constructor(data: MessageEmbedOptions = {}, user?: User) {
    super(data);
    if (!data.color) this.setColor(config.style.colours.primary);
    if (user)
      return this.setFooter({
        text: `${user.tag} | Powered by ${config.style.name.short}`,
        iconURL: user.displayAvatarURL(),
      });
    this.setFooter({
      text: `Powered by ${config.style.name.short}`,
    });
  }
}
