import Command from "../../classes/Command";
import pgTruth from "../../lib/truthordare/truth/pg-truth";
import { embed } from "../../helper/util/embed";

export default new Command({
  name: "truth",
  description: "Fetch a truth.",
  category: "truthordare",
  perms: [],
  options: [],
  async execute({ bot, args, ctx }) {
    const categories = [pgTruth];
    const arr = categories[Math.floor(Math.random() * categories.length)];
    return ctx.reply({
      embeds: [
        embed(
          {
            title: `Truth - ${arr[Math.floor(Math.random() * arr.length)]}`,
          },
          ctx,
          bot
        ),
      ],
    });
  },
});
