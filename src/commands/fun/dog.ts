import axios from "axios";
import Command from "../../classes/Command";
import { embed } from "../../helper/util/embed";

export default new Command({
  name: "dog",
  description: "Fetch a random dog. Aww",
  category: "fun",
  perms: [],

  async execute({ bot, ctx }) {
    await ctx.deferReply();
    const { data } = await axios.get("https://dog.ceo/api/breeds/image/random");
    const em = embed(
      {
        image: {
          url: data.message,
        },
      },
      ctx,
      bot
    );
    ctx.editReply({ embeds: [em] });
  },
});
