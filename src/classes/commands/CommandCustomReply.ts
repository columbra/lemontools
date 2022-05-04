/**
 * @fileoverview Custom reply structure which is compatible with Discord.js
 * @since v3.0.0
 */

import type { MessageActionRow } from "discord.js";
import LemonToolsEmbed from "../embeds/LemonToolsEmbed";

export default class Reply {
  public embeds: LemonToolsEmbed[] = [];
  public content?: string;
  public components: MessageActionRow[] = [];
  public readonly time = new Date();
  public readonly timestamp = this.time.toISOString();
  constructor(
    reply: LemonToolsEmbed | LemonToolsEmbed[] | string | ReplyOptions,
    public ephemeral = false
  ) {
    if (Array.isArray(reply)) this.embeds.push(...reply);
    else if (typeof reply === "string") this.content = reply;
    else if (reply instanceof LemonToolsEmbed) this.embeds.push(reply);
    else {
      this.content = reply.content;
      if (reply.embeds) this.embeds.push(...reply.embeds);
      if (reply.components) this.components.push(...reply.components);
    }
  }

  public addEmbed(embed: LemonToolsEmbed) {
    this.embeds.push(embed);
  }

  public clearEmbeds() {
    this.embeds = [];
  }

  public addContent(content: string) {
    this.content = this.content?.concat?.(content) ?? content;
  }

  public clearContent() {
    this.content = undefined;
  }
}

export interface ReplyOptions {
  embeds?: LemonToolsEmbed[];
  content?: string;
  components?: MessageActionRow[];
}
