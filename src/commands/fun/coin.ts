import Command from "../../classes/Command";
import { rnd } from "../../helper/util/number";

export default new Command({
  name: "coin",
  description: "Flip a coin",
  category: "fun",
  perms: [],
  async execute({ bot, ctx }) {
    const coin = rnd(1, 2);
    ctx.reply(`:coin: You got ${coin === 1 ? "heads" : "tails"}`);
  },
});
