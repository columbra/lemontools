import { model, Schema } from "mongoose";

const TempRoleSchema = new Schema({
  serverId: String, // Server ID
  roleId: String, // Role ID
  userId: String, // User ID of person who has the role
  expiry: Date, // Date when the role expires
  byId: String, // User ID of person who added the role
});

export interface TempRole {
  serverId: string;
  roleId: string;
  userId: string;
  expiry: Date;
  byId: string;
}

export default model("TempRole", TempRoleSchema);
