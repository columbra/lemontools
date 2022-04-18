import AutoCompleter from "../../classes/AutoCompleter";

export default new AutoCompleter("help", ({ bot, ctx }) => {
  return bot.CommandManager.commands.filter((cmd) =>
    cmd.name
      .toLowerCase()
      .includes(ctx.options.getString("command").toLowerCase())
  ).map((cmd) => ({
    name: cmd.name,
    value: cmd.name,
  }));
});
