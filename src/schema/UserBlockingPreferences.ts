import { model, Schema } from "mongoose";

const UserBlockingPreferencesSchema = new Schema({
  userId: String,
  blocks: [String],
})

export default model("UserBlockingPreferences", UserBlockingPreferencesSchema);