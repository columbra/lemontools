import Event from "../../classes/Event";

export default new Event("ready", async (bot) => {
  bot.logger.info("Ready event fired.");
});
