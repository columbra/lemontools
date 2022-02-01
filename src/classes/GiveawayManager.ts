import { GiveawaysManager as GWM } from "../lib/discord-giveaways/";
import { UpdateWithAggregationPipeline, UpdateQuery } from "mongoose";
import Giveaway from "../schema/Giveaway";

export default class GiveawaysManager extends GWM {
  async getAllGiveaways() {
    return await Giveaway.find().lean().exec() as unknown as any;
  }
  async saveGiveaway(_msgId: any, data: any) {

    Giveaway.create(data);
  }
  async editGiveaway(messageId: any, giveawayData: UpdateWithAggregationPipeline | UpdateQuery<any>) {
    // Find by messageId and update it
    await Giveaway
      .updateOne({ messageId }, giveawayData, { omitUndefined: true })
      .exec();
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageId: any) {
    // Find by messageId and delete it
    await Giveaway.deleteOne({ messageId }).exec();
    return true
  }
}
