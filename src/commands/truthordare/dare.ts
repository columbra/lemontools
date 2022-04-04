import Command from "../../classes/Command";
import pgDare from "../../lib/truthordare/dare/pg-dare";
import { embed } from "../../helper/util/embed";

export default new Command({
  name: "dare",
  description: "Fetch a dare.",
  category: "truthordare",
  perms: [],
  options: [],
  async execute({ bot, args, ctx }) {
    const categories = [pgDare];
    const arr = categories[Math.floor(Math.random() * categories.length)];
    return ctx.reply({
      embeds: [
        embed(
          {
            title: `Dare - ${arr[Math.floor(Math.random() * arr.length)]}`,
          },
          ctx,
          bot
        ),
      ],
    });
  },
});
