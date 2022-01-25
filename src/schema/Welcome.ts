import { model, Schema } from "mongoose";

const WelcomeSchema = new Schema (
  {
    message: String,
    embed: Object,
    serverId: String,
    lastChangesBy: String
  }
)

export default model("WelcomeScheme", WelcomeSchema)