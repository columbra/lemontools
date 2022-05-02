/**
 * @fileoverview Custom reply structure which is compatible with Discord.js
 * @since v3.0.0
 */

import type LemonToolsEmbed from "../embeds/LemonToolsEmbed";

export default class Reply {
  public embeds: LemonToolsEmbed[] = [];
  public content?: string;
  public readonly time = new Date();
  public readonly timestamp = this.time.toISOString();
  constructor(reply: LemonToolsEmbed | LemonToolsEmbed[] | string) {
    if (Array.isArray(reply)) this.embeds.push(...reply);
    else if (typeof reply === "string") this.content = reply;
    else this.embeds.push(reply);
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
