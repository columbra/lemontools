import { GiveawaysManager } from "discord-giveaways";
import { UpdateWithAggregationPipeline, UpdateQuery } from "mongoose";
import giveawayModel from "../schema/Giveaway";
class MongooseGiveaways extends GiveawaysManager {
  // This function is called when the manager needs to get all giveaways which are stored in the database.
  async getAllGiveaways() {
    // Get all giveaways from the database. We fetch all documents by passing an empty condition.
    return await giveawayModel.find().lean().exec();
  }

  // This function is called when a giveaway needs to be saved in the database.
  async saveGiveaway(messageId: any, giveawayData: any) {
    // Add the new giveaway to the database
    await giveawayModel.create(giveawayData);
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be edited in the database.
  async editGiveaway(
    messageId: any,
    giveawayData: UpdateWithAggregationPipeline | UpdateQuery<any> | undefined
  ) {
    // Find by messageId and update it
    await giveawayModel
      .updateOne({ messageId }, giveawayData, { omitUndefined: true })
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId: any) {
    // Find by messageId and delete it
    await giveawayModel.deleteOne({ messageId }).exec();
    // Don't forget to return something!
    return true;
  }
}
export default MongooseGiveaways;
