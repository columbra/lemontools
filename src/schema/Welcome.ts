import { MessageEmbedOptions } from "discord.js";
import { model, Schema } from "mongoose";

const WelcomeSchema = new Schema({
  message: String,
  embed: Object,
  serverId: String,
  lastChangesBy: String,
});

export interface WelcomeInterface {
  message: string;
  embed: MessageEmbedOptions;
  serverId: string;
  lastChangesBy: string;
}

export default model("WelcomeScheme", WelcomeSchema);
