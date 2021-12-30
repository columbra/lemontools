import AutoCompleter from "../classes/AutoComplete";

export default new AutoCompleter({
  command: "help",
  execute({ ctx, bot }) {
    return Array.from(bot.commands)
      .filter(([, c]) => c.name.includes(ctx.options.getString("command")))
      .map(([, c]) => ({
        name: c.name,
        value: c.name,
      }));
  },
});
