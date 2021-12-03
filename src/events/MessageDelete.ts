import { ClientEvents, Message, PartialMessage } from "discord.js";
import { Event } from "../interfaces/Event";

export default class MessageDelete extends Event {
  event = "messageDelete" as keyof ClientEvents;
  execute = async (msg: PartialMessage[]) => {
    const [message] = msg;
    const snipe = this.bot.recentMessages.get(message.channelId);
    if (!snipe?.length) return;
    const sniperCollection = this.bot.snipedMessages.get(message.channelId);
    const sniperMessage = snipe.find((m) => m.id === message.id);
    if (!sniperMessage) return;
    if (!sniperCollection)
      return this.bot.snipedMessages.set(message.channelId, [sniperMessage]);
    this.bot.snipedMessages.set(message.channelId, [
      sniperMessage,
      ...sniperCollection,
    ]);
  };
}
