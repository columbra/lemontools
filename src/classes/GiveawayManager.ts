import { GiveawaysManager as GWM } from "discord-giveaways";
import { UpdateWithAggregationPipeline, UpdateQuery } from "mongoose";
import Giveaway from "../schema/Giveaway";

export default class GiveawaysManager extends GWM {
  async getAllGiveaways() {
    return await Giveaway.find().lean().exec();
  }
  async saveGiveaway(_msgId: any, data: any) {

    Giveaway.create(data);
    return true;
  }
  async editGiveaway(messageId: any, giveawayData: UpdateWithAggregationPipeline | UpdateQuery<any>) {
    // Find by messageId and update it
    await Giveaway
      .updateOne({ messageId }, giveawayData, { omitUndefined: true })
      .exec();
    // Don't forget to return something!
    return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId: any) {
    // Find by messageId and delete it
    await Giveaway.deleteOne({ messageId }).exec();
    // Don't forget to return something!
    return true;
  }
}
