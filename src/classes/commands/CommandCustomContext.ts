/**
 * @fileoverview Custom interaction (ctx) with useful additions & custom behaviour
 * @since v3.0.0
 */

import type { CommandInteraction } from "discord.js";
import type LemonTools from "../../LemonTools";
import type Reply from "./CommandCustomReply";

export default class CommandCustomContext<S = unknown> {
  public readonly time: Date;
  public readonly timestamp: string;
  public state: Record<string | number | symbol, S> = {};
  constructor(public lemontools: LemonTools, public interaction: CommandInteraction) {
    this.time = interaction.createdAt;
    this.timestamp = this.time.toISOString();
  }

  public reply(reply: Reply) {
    return this.interaction.reply(reply);
  }

  public async edit(reply: Reply) {
    if (!this.interaction.replied)
      throw new TypeError(`Cannot edit a message that hasn't been replied to`);
    return await this.interaction.editReply(reply);
  }

  public async fetchReply() {
    if (!this.interaction.replied) return undefined;
    return await this.interaction.fetchReply();
  }

  public async followUp(reply: Reply) {
    if (!this.interaction.replied)
      throw new TypeError(
        `Cannot follow up a message that hasn't been replied to`
      );
    return await this.interaction.followUp(reply);
  }
}
