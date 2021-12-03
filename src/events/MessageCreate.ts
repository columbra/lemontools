import { ClientEvents, Message } from "discord.js";
import { Event } from "../interfaces/Event";

export default class MessageCreate extends Event {
  event: keyof ClientEvents = "messageCreate";
  execute = async (message: Message[]) => {
    const [msg] = message;
    if (msg.author.bot) return;
    if (msg?.content.includes("NO SNIPE")) return;
    const { recentMessages } = this.bot;
    const msgArray = recentMessages.get(msg.channelId);
    if (!msgArray) return recentMessages.set(msg.channelId, [msg]);
    msgArray.unshift(msg);
    if (msgArray.length > 30) msgArray.pop();
  };
}
