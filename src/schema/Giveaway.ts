import mongoose from "mongoose";
import { Schema } from "mongoose";
const giveawaySchema = new mongoose.Schema(
  {
    messageId: String,
    channelId: String,
    guildId: String,
    startAt: Number,
    endAt: Number,
    ended: Boolean,
    winnerCount: Number,
    prize: String,
    messages: {
      giveaway: String,
      giveawayEnded: String,
      inviteToParticipate: String,
      drawing: String,
      dropMessage: String,
      winMessage: Schema.Types.Mixed,
      embedFooter: Schema.Types.Mixed,
      noWinner: String,
      winners: String,
      endedAt: String,
      hostedBy: String,
    },
    thumbnail: String,
    hostedBy: String,
    winnerIds: { type: [String], default: undefined },
    reaction: Schema.Types.Mixed,
    botsCanWin: Boolean,
    embedColor: Schema.Types.Mixed,
    embedColorEnd: Schema.Types.Mixed,
    exemptPermissions: { type: [], default: undefined },
    exemptMembers: String,
    bonusEntries: String,
    extraData: Schema.Types.Mixed,
    lastChance: {
      enabled: Boolean,
      content: String,
      threshold: Number,
      embedColor: Schema.Types.Mixed,
    },
    pauseOptions: {
      isPaused: Boolean,
      content: String,
      unPauseAfter: Number,
      embedColor: Schema.Types.Mixed,
      durationAfterPause: Number,
    },
    isDrop: Boolean,
    allowedMentions: {
      parse: { type: [String], default: undefined },
      users: { type: [String], default: undefined },
      roles: { type: [String], default: undefined },
    },
  },
  { id: false }
);

// Create the model
export default mongoose.model("giveaways", giveawaySchema);
