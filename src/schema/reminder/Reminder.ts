import { model, Schema } from "mongoose";

const ReminderSchema = new Schema({
  time: Number,
  reminder: String,
  userId: String,
  created: Number,
  uuid: String
})

export default model("Reminder", ReminderSchema)

export interface ReminderType {
  time: number,
  reminder: string,
  userId: string,
  created: number,
  uuid: string
}