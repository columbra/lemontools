import { MessageEmbedOptions } from "discord.js";
import { model, Schema } from "mongoose";

const WelcomeSchema = new Schema({
  embed: Object,
  serverId: String,
  lastChangesBy: String,
});

export interface WelcomeInterface {
  embed: MessageEmbedOptions;
  serverId: string;
  lastChangesBy: string;
}

export default model("WelcomeScheme", WelcomeSchema);
