import AutoCompleter from "../classes/AutoComplete";

export default new AutoCompleter({
  command: "giveaways",
  execute({ ctx, bot }) {
    const subcmd = ctx.options.getSubcommand(true);

    const prize = ctx.options.getString("prize");
    const giveaways = bot.GiveawayManager.giveaways.filter(
      (g) => g.guildId === ctx.guildId && g.prize.toLowerCase().includes(prize.toLowerCase())
    ); // Filter for their guild only
    return giveaways
      .slice(0, 20)
      .map((g) => ({ name: g.prize, value: g.messageId }));
    // No break since it is unreachable
  },
});
