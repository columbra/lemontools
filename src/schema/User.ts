import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  id: String,
  permissions: Number, // Bitfield, stored in decimal format
  note: String,
});

export const User = model("User", UserSchema);
