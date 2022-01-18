import axios from "axios";
import Command from "../../classes/Command";
import { MarsPhoto } from "../../typings/nasa/mars";
import { embed } from "../../util/embed";
import { rnd } from "../../util/number";
import { epherr } from "../../util/strings";

export default new Command({
  name: "mars",
  description: "Get some pictures of Mars from the rover Curiosity",
  category: "nasa",
  perms: [],

  async execute({ bot, ctx }) {
    await ctx.deferReply();
    const res = await axios
      .get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${rnd(
          // Controls what mars day
          1, // the photos come from (1 day on mars = 1 sol). This is randomised, so we should get a random
          1000 // image each time (hopefully)
        )}&api_key=${process.env.NASA}`
      )
      .catch((err) => {
        ctx.editReply(epherr`Something went wrong...`);
      });
    if (!res) return;
    const { photos } = res.data;
    let photo: MarsPhoto = photos[Math.floor(Math.random() * photos.length)];
    while (!photo) photo = photos[Math.floor(Math.random() * photos.length)];
    const em = embed(
      {
        image: {
          url: photo.img_src,
        },
        description: `Photo ID: \`${photo.id}\`
      Mars Day: \`${photo.sol}\``,
      },
      ctx,
      bot
    );
    ctx.editReply({
      embeds: [em],
    });
  },
});
